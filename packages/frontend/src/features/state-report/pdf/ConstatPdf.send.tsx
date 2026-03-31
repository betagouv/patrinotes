import { Center } from "#components/MUIDsfr.tsx";
import { StateReportPDFDocument } from "@patrinotes/pdf/constat";
import { useMemo } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";
import { BlobProvider, type BlobProviderParams, PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";

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

import { PDFObject } from "react-pdfobject";
import Button from "@mui/material/Button";
import { MdDownload as DownloadIcon } from "react-icons/md";

const supportsPdfInline = (() => {
  try {
    return (PDFObject as any).supportsPDFs;
  } catch {
    return false;
  }
})();

const BlobViewer = ({ ...props }: BlobProviderParams) => {
  if (!supportsPdfInline) {
    return (
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        component="a"
        href={props.url ?? undefined}
        download="constat.pdf"
        disabled={!props.url}
      >
        Télécharger le PDF
      </Button>
    );
  }

  return <PDFObject url={props.url!} assumptionMode />;
};
