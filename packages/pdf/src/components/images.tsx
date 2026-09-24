export const ImagesTable = ({ images }: { images: (Image | undefined)[] }) => {
  return (
    <ImagesTableContainer>
      {images.map((image) => (
        <ImageCell image={image!} />
      ))}
    </ImagesTableContainer>
  );
};

export const ImagesTableContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        marginTop: "8px",
        marginBottom: "8px",
        width: "100%",
        flexDirection: "row",
      }}
    >
      {children}
    </div>
  );
};

const CELL_HEIGHT = 180;

const ImageCell = ({ image }: { image: Image | undefined }) => {
  if (!image) return null;

  // With known natural dimensions we pin the cell (and its label) to the exact
  // width the image will render at, instead of "auto" — react-pdf-html's layout
  // engine can't correctly derive an auto column's width from an unconstrained
  // text child, which otherwise makes long labels push the next cell sideways
  // instead of the row wrapping.
  const width = image.width && image.height ? Math.round((image.width / image.height) * CELL_HEIGHT) : undefined;

  return (
    <unbreakable
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: width ? `${width}px` : undefined,
      }}
    >
      <img
        src={image.url}
        data-attachment-id={image.attachmentId}
        style={{ height: `${CELL_HEIGHT}px`, width: width ? `${width}px` : "auto", display: "block" }}
      />
      <div
        style={{
          textAlign: "left",
          fontSize: "8pt",
          color: "gray",
          lineHeight: 1.4,
          width: width ? `${width}px` : undefined,
          alignSelf: width ? undefined : "stretch",
          wordBreak: "break-word",
        }}
      >
        {image.label ? image.label : ""}
      </div>
    </unbreakable>
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
