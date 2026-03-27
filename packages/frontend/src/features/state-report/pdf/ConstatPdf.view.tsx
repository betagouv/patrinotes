import { getStateReportHtmlString, StateReportPDFDocument } from "@cr-vif/pdf/constat";
import { PDFViewer } from "@react-pdf/renderer";
import { useMemo } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";
import { Center } from "#components/MUIDsfr.tsx";

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
      <Center width="800px" flexDirection="column" paddingX="16px" marginTop="32px" marginBottom="96px">
        <PDFViewer style={{ height: "calc(100vh - 80px)", maxWidth: "100vw" }} width="100%" showToolbar={false}>
          {document}
        </PDFViewer>
      </Center>
    </Center>
  );
};
