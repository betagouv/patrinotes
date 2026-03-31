import "@ungap/with-resolvers";
import { Box } from "@mui/material";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

const SCALE = 1.2;
const RENDER_MARGIN = 1; // pages to render beyond visible

export const PDFViewerPaginated = ({ blob, url }: { blob?: Blob; url?: string }) => {
  const blobUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);
  const resolvedUrl = blobUrl ?? url;
  if (!resolvedUrl) return null;
  return <PDFCanvasViewer url={resolvedUrl} />;
};

type PdfDocument =
  Awaited<ReturnType<ReturnType<typeof pdfjsLib.getDocument>["promise"]["then"]>> extends never
    ? never
    : Awaited<ReturnType<typeof pdfjsLib.getDocument>["promise"]>;

const PDFCanvasViewer = ({ url }: { url: string }) => {
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set([1, 2]));

  useEffect(() => {
    let cancelled = false;
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(async (doc) => {
      if (cancelled) return;
      const firstPage = await doc.getPage(1);
      const viewport = firstPage.getViewport({ scale: SCALE });
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setPageHeight(viewport.height);
      setPageWidth(viewport.width);
      setRenderedPages(new Set(Array.from({ length: Math.min(1 + RENDER_MARGIN, doc.numPages) }, (_, i) => i + 1)));
    });
    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [url]);

  const onPageVisible = useCallback((pageNumber: number) => {
    setRenderedPages((prev) => {
      const next = new Set(prev);
      for (let i = pageNumber - RENDER_MARGIN; i <= pageNumber + RENDER_MARGIN; i++) {
        if (i >= 1) next.add(i);
      }
      return next;
    });
  }, []);

  if (!pdfDoc || !pageHeight) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" gap="16px" py="16px">
      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
        <PDFPage
          key={pageNumber}
          pdfDoc={pdfDoc}
          pageNumber={pageNumber}
          pageHeight={pageHeight}
          pageWidth={pageWidth}
          isInWindow={renderedPages.has(pageNumber)}
          onVisible={onPageVisible}
        />
      ))}
    </Box>
  );
};

const PDFPage = ({
  pdfDoc,
  pageNumber,
  pageHeight,
  pageWidth,
  isInWindow,
  onVisible,
}: {
  pdfDoc: PdfDocument;
  pageNumber: number;
  pageHeight: number;
  pageWidth: number;
  isInWindow: boolean;
  onVisible: (pageNumber: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Observe visibility to expand render window
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(pageNumber);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNumber, onVisible]);

  // Render page onto canvas when in window
  useEffect(() => {
    if (!isInWindow || !canvasRef.current) return;
    let cancelled = false;
    pdfDoc.getPage(pageNumber).then((page) => {
      if (cancelled || !canvasRef.current) return;
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      page.render({ canvasContext: ctx, viewport });
    });
    return () => {
      cancelled = true;
    };
  }, [isInWindow, pdfDoc, pageNumber]);

  return (
    <Box
      ref={containerRef}
      width={{ xs: "100%", lg: `${pageWidth}px` }}
      height={isInWindow ? undefined : `${pageHeight}px`}
      boxShadow="0px 10.18px 30.54px 0px #00001229"
      bgcolor={isInWindow ? undefined : "#e0e0e0"}
      flexShrink={0}
    >
      {isInWindow && (
        <Box
          data-test-id={"pdf-canvas-" + pageNumber}
          ref={canvasRef}
          component="canvas"
          width={{ xs: "100%", lg: `${pageWidth}px` }}
          display="block"
        />
      )}
    </Box>
  );
};
