# Dans le conteneur backend de Docs : python manage.py shell < import_docs.py
# Lit /tmp/reports.json et crée un document Docs par compte rendu (contenu en JSON BlockNote, photos en pièces jointes).
import io, json, os, struct, uuid, zlib

from django.conf import settings
from django.core.files.storage import default_storage
from django.db import transaction

from core import models
from core.services import mime_types
from core.services.converter_services import YdocConverter
from core.services.yhub_services import YHubService

MEDIA_BASE = settings.MEDIA_BASE_URL.rstrip("/")
user = models.User.objects.get(email=os.environ.get("TEST_EMAIL", "martin@essai.local"))
conv = YdocConverter()


def png(hex_color, w=1200, h=800):
    r, g, b = (int(hex_color[i : i + 2], 16) for i in (1, 3, 5))
    row = b"\x00" + bytes([r, g, b]) * w
    raw = zlib.compress(row * h, 9)

    def chunk(t, d):
        c = t + d
        return struct.pack(">I", len(d)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", raw)
        + chunk(b"IEND", b"")
    )


def upload(document, data, name):
    key = f"{document.key_base}/attachments/{uuid.uuid4()}.png"
    default_storage.connection.meta.client.upload_fileobj(
        io.BytesIO(data),
        default_storage.bucket_name,
        key,
        ExtraArgs={
            "Metadata": {"owner": str(user.id), "status": "ready"},
            "ContentType": "image/png",
            "ContentDisposition": f'inline; filename="{name}"',
        },
    )
    document.attachments.append(key)
    return f"{MEDIA_BASE}/media/{key}"


from html.parser import HTMLParser


class HtmlToBlockNote(HTMLParser):
    """Le HTML (simple) des comptes rendus Patrinotes -> blocs BlockNote."""

    def __init__(self):
        super().__init__()
        self.blocks, self.inline, self.bold, self.href, self.link = [], None, 0, None, None

    def _text(self, text):
        if self.inline is None:
            if not text.strip():
                return
            self.inline = []
        node = {"type": "text", "text": text, "styles": {"bold": True} if self.bold else {}}
        (self.link["content"] if self.link else self.inline).append(node)

    def handle_starttag(self, tag, attrs):
        if tag == "p":
            self.inline = []
        elif tag == "strong":
            self.bold += 1
        elif tag == "br":
            self._text("\n")
        elif tag == "a":
            self.link = {"type": "link", "href": dict(attrs).get("href", ""), "content": []}
        elif tag == "hr":
            self.blocks.append({"type": "divider"})

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == "strong":
            self.bold -= 1
        elif tag == "a" and self.link:
            (self.inline if self.inline is not None else []).append(self.link)
            self.link = None
        elif tag == "p" and self.inline is not None:
            while self.inline and self.inline[-1].get("text") == "\n":
                self.inline.pop()
            self.blocks.append({"type": "paragraph", "content": self.inline})
            self.inline = None

    def handle_data(self, data):
        self._text(data)


def html_to_blocks(html):
    p = HtmlToBlockNote()
    p.feed(html)
    p.close()
    return p.blocks


results = []
for rep in json.load(open("/tmp/reports.json")):
    with transaction.atomic():
        doc = models.Document.add_root(creator=user, title=rep["title"])
        models.DocumentAccess.objects.create(document=doc, user=user, role=models.RoleChoices.OWNER)

    # 1. HTML Patrinotes -> JSON BlockNote (le format natif de Docs)
    blocks = html_to_blocks(rep["html"].replace("\u200b", ""))

    # 2. Photos : vraies pièces jointes du document + blocs image BlockNote
    blocks.append({"type": "heading", "props": {"level": 2}, "content": [{"type": "text", "text": "Photos", "styles": {}}]})
    for i, photo in enumerate(rep["photos"], 1):
        url = upload(doc, png(photo["color"]), f"photo-{i}.png")
        blocks.append(
            {
                "type": "image",
                "props": {"url": url, "name": f"photo-{i}.png", "caption": f"N°{i} – {photo['label']}", "previewWidth": 512},
            }
        )
    doc.save(update_fields=["attachments", "updated_at"])

    # 3. JSON BlockNote -> Yjs, puis amorçage du serveur de collaboration
    update = conv.convert(json.dumps(blocks).encode(), mime_types.BLOCKNOTE, mime_types.YJS)
    YHubService(user=user).create_ydoc(doc, update)

    json.dump(blocks, open(f"/tmp/blocks-{rep['id']}.json", "w"), ensure_ascii=False, indent=2)
    results.append((rep["id"], str(doc.id), len(blocks)))

for r in results:
    print("RESULT", *r)
