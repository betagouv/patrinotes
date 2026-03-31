import { Center } from "#components/MUIDsfr.tsx";
import { PDFViewerPaginated } from "#components/PDFViewerPaginated";
import { StateReportPDFDocument } from "@patrinotes/pdf/constat";
import { useMemo } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";
import { BlobProvider, type BlobProviderParams } from "@react-pdf/renderer";

export const SendConstatPdf = () => {
  const htmlString = useHtmlString();
  const user = useUser()!;

  const document = useMemo(
    () => (
      <StateReportPDFDocument
        htmlString={htmlString}
        images={{ marianne: "/marianne.png", marianneFooter: "/marianne_footer.png" }}
        service={user.service as any}
      />
    ),
    [htmlString, user.service?.id],
  );

  return (
    <Center>
      <Center width="800px" flexDirection="column" paddingX="16px" marginTop="32px" marginBottom="96px">
        <BlobProvider document={document}>{(props) => <BlobViewer {...props} />}</BlobProvider>
      </Center>
    </Center>
  );
};

const BlobViewer = ({ blob }: BlobProviderParams) => {
  console.log("blob");
  if (!blob) return null;
  return <PDFViewerPaginated blob={blob} />;
};
