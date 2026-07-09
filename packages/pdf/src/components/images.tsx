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

const ImageCell = ({ image }: { image: Image | undefined }) => {
  if (!image) return null;
  return (
    <unbreakable style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
      <img
        src={image.url}
        data-attachment-id={image.attachmentId}
        style={{ height: "180px", width: "auto", display: "block" }}
      />
      <div
        style={{
          textAlign: "left",
          fontSize: "8pt",
          color: "gray",
          lineHeight: 1.4,
          alignSelf: "stretch",
          wordBreak: "break-word",
        }}
      >
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
