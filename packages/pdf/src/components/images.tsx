// Photos are laid out in rows computed here rather than with flex-wrap: react-pdf-html's layout
// engine can't size a wrapping cell from its label, so a long label used to widen its cell and
// push the next photo to a new line. Every cell (and its label) is pinned to its photo's width,
// and a row is shrunk to fit the page width before a photo is sent to the next line.

/** Width a row of photos may use; fits the content width even inside an indented list. */
const ROW_WIDTH = 480;
const GAP = 16;
/** Height of a photo when its row has room. */
const MAX_HEIGHT = 180;
/** A row is shrunk down to this height to keep photos side by side before wrapping. */
const MIN_HEIGHT = 110;
/** Aspect ratio assumed for photos whose dimensions were not recorded. */
const DEFAULT_RATIO = 4 / 3;

export const ImagesTable = ({ images }: { images: (Image | undefined)[] }) => {
  const rows = layoutRows(images.filter((image): image is Image => !!image));
  if (!rows.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${GAP}px`,
        marginTop: "8px",
        marginBottom: "8px",
        width: "100%",
      }}
    >
      {rows.map((row, i) => (
        <unbreakable key={i} style={{ display: "flex", flexDirection: "row", gap: `${GAP}px`, alignItems: "flex-start" }}>
          {row.cells.map(({ image, ratio }) => (
            <ImageCell
              key={image.attachmentId}
              image={image}
              width={Math.floor(ratio * row.height)}
              height={Math.floor(row.height)}
            />
          ))}
        </unbreakable>
      ))}
    </div>
  );
};

const getRatio = (image: Image) =>
  image.width && image.height && image.width > 0 && image.height > 0 ? image.width / image.height : DEFAULT_RATIO;

/** Height at which photos with these aspect ratios exactly fill a row. */
const getFittingHeight = (ratios: number[]) =>
  (ROW_WIDTH - GAP * (ratios.length - 1)) / ratios.reduce((sum, r) => sum + r, 0);

export const layoutRows = (images: Image[]) => {
  const rows: { image: Image; ratio: number }[][] = [];
  let current: { image: Image; ratio: number }[] = [];

  for (const image of images) {
    const cell = { image, ratio: getRatio(image) };
    const candidate = [...current, cell];
    if (current.length === 0 || getFittingHeight(candidate.map((c) => c.ratio)) >= MIN_HEIGHT) {
      current = candidate;
    } else {
      rows.push(current);
      current = [cell];
    }
  }
  if (current.length) rows.push(current);

  return rows.map((cells) => ({
    cells,
    height: Math.min(MAX_HEIGHT, getFittingHeight(cells.map((c) => c.ratio))),
  }));
};

const ImageCell = ({ image, width, height }: { image: Image; width: number; height: number }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: `${width}px` }}>
      <img
        src={image.url}
        data-attachment-id={image.attachmentId}
        style={{ width: `${width}px`, height: `${height}px`, objectFit: "contain", display: "block" }}
      />
      {image.label ? (
        <div
          style={{
            textAlign: "left",
            fontSize: "8pt",
            color: "gray",
            lineHeight: 1.4,
            marginTop: "2px",
            width: `${width}px`,
            maxWidth: `${width}px`,
            wordBreak: "break-word",
          }}
        >
          {image.label}
        </div>
      ) : null}
    </div>
  );
};
type Image = { url: string; label?: string | null; attachmentId: string; width?: number | null; height?: number | null };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      unbreakable: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
