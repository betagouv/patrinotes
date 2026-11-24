# python manage.py shell < export_doc.py  -> /tmp/export.json (HTML du doc + photos en base64)
import base64, json, os, re
from django.core.files.storage import default_storage
from core import models
from core.services import mime_types
from core.services.converter_services import YdocConverter
from core.services.yhub_services import YHubService

out = []
for d in models.Document.objects.filter(creator__email=os.environ.get("TEST_EMAIL", "martin@essai.local")).order_by("created_at"):
    update = YHubService(user=d.creator).get_ydoc(d)
    if not update:
        continue
    html = YdocConverter().convert(update, mime_types.YJS, mime_types.HTML)
    blocks = YdocConverter().convert(update, mime_types.YJS, mime_types.JSON)
    photos = []
    for b in blocks:
        if b["type"] == "image":
            key = b["props"]["url"].split("/media/", 1)[1]
            data = default_storage.open(key).read()
            photos.append({"label": b["props"].get("caption"), "data": "data:image/png;base64," + base64.b64encode(data).decode()})
    out.append({"id": str(d.id), "title": d.title, "html": html, "photos": photos})
json.dump(out, open("/tmp/export.json", "w"), ensure_ascii=False)
print("EXPORTED", [(o["title"][:30], len(o["photos"])) for o in out])
