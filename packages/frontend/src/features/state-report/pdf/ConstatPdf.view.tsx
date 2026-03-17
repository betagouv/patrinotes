import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@cr-vif/pdf/constat";
import { pdf, BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";

const supportsPromiseWithResolvers = typeof (Promise as any).withResolvers === "function";

export const ViewConstatPdf = () => {
  const htmlString = useHtmlString();
  const user = useUser()!;

  return (
    <Center>
      <Center width="800px" flexDirection="column">
        <View
          htmlString={htmlString}
          images={{ marianne: "/marianne.png", marianneFooter: "/marianne_footer.png" }}
          service={user.service as any}
        />
      </Center>
    </Center>
  );
};

const View = (props: StateReportPDFDocumentProps) =>
  supportsPromiseWithResolvers ? <ModernView {...props} /> : <LegacyView {...props} />;

const ModernView = (props: StateReportPDFDocumentProps) => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <PDFViewer width="100%" height={height} showToolbar={false}>
      <StateReportPDFDocument {...props} />
    </PDFViewer>
  );
};

const LegacyView = (props: StateReportPDFDocumentProps) => {
  const query = useQuery({
    queryKey: ["state-report-pdf", props.htmlString],
    queryFn: async () => {
      const blob = await pdf(<StateReportPDFDocument {...props} />).toBlob();
      return blob;
    },
    gcTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!props.htmlString,
  });

  if (query.isLoading || !query.data)
    return (
      <Center height="100%" mt="100px">
        <Spinner />
      </Center>
    );

  return <PdfCanvas blob={query.data as Blob} />;
};
