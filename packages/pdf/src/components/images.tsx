export const ImagesTable = ({ images }: { images: (Image | undefined)[] }) => {
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
      {images.map((image) => (
        <ImageCell image={image!} />
      ))}
    </div>
  );
};

const ImageCell = ({ image }: { image: Image | undefined }) => {
  if (!image) return null;
  return (
    <unbreakable>
      <img src={image.url} data-attachment-id={image.attachmentId} style={{ width: "auto", height: "180px" }} />
      <div style={{ width: "100%", textAlign: "left", fontSize: "8pt", color: "gray", lineHeight: 1.4 }}>
        {image.label ? image.label : ""}
      </div>
    </unbreakable>
  );
};
type Image = { url: string; label?: string | null; attachmentId: string };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      unbreakable: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
