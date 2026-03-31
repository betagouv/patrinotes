import "@ungap/with-resolvers";
import { usePdf } from "@mikecousins/react-pdf";
import { Button } from "#components/MUIDsfr";
import { Box } from "@mui/material";
import { useRef, useState, useMemo } from "react";

export const PDFViewerPaginated = ({ blob, url }: { blob?: Blob; url?: string }) => {
  const blobUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);
  const resolvedUrl = blobUrl ?? url;
  if (!resolvedUrl) return null;
  return <PDFCanvasViewer url={resolvedUrl} />;
};

const PDFCanvasViewer = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  usePdf({
    file: url,
    canvasRef,
    page: currentPage,
    scale: 1.2,
    workerSrc: "/pdfjs/build/pdf.worker.min.mjs",
    onDocumentLoadSuccess: (doc) => setTotalPages(doc.numPages),
  });

  const navigation =
    totalPages > 1 ? (
      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" maxWidth="800px">
        <Button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage <= 1}>
          Précédent
        </Button>
        <span>
          <Box component="span" display={{ xs: "none", sm: "inline" }}>
            Page{" "}
          </Box>
          {currentPage} / {totalPages}
        </span>
        <Button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= totalPages}>
          Suivant
        </Button>
      </Box>
    ) : null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {navigation}
      <Box
        ref={canvasRef}
        component="canvas"
        width={{ xs: "100%", lg: "800px" }}
        my="16px"
        boxShadow="0px 10.18px 30.54px 0px #00001229"
      />
      {navigation}
    </Box>
  );
};
