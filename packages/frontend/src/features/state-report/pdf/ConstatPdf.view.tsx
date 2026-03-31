import { getStateReportHtmlString, StateReportPDFDocument } from "@patrinotes/pdf/constat";
import { BlobProvider } from "@react-pdf/renderer";
import { useMemo } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";
import { Center } from "#components/MUIDsfr.tsx";
import { PDFViewerPaginated } from "#components/PDFViewerPaginated";

export const ViewConstatPdf = () => {
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
      <Center
        width="800px"
        flexDirection="column"
        paddingX={{ xs: "16px", lg: "0" }}
        marginTop="32px"
        marginBottom="96px"
      >
        <BlobProvider document={document}>
          {({ blob }) => (blob ? <PDFViewerPaginated blob={blob} /> : null)}
        </BlobProvider>
      </Center>
    </Center>
  );
};
