import { StateReportPDFDocument } from "@patrinotes/pdf/constat";
import { BlobProvider } from "@react-pdf/renderer";
import { JSX, useEffect, useMemo } from "react";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";
import { Center } from "#components/MUIDsfr.tsx";
import { PDFViewerPaginated } from "#components/PDFViewerPaginated";
import { Spinner } from "#components/Spinner.tsx";
import { useSendConstatFormContext } from "./ConstatPdfContext";

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
          {({ blob, loading, error }) => {
            if (loading) {
              return (
                <Center mt="64px">
                  <Spinner />
                </Center>
              );
            }
            if (error) {
              return <div>Error: {error.message}</div>;
            }
            return (
              <BlobSync blob={blob!}>
                <PDFViewerPaginated blob={blob!} />
              </BlobSync>
            );
          }}
        </BlobProvider>
      </Center>
    </Center>
  );
};

// TODO: do better
const BlobSync = ({ blob, children }: { blob: Blob; children: JSX.Element }) => {
  const form = useSendConstatFormContext();
  useEffect(() => {
    form.setValue("pdfBlob", blob);
  }, [blob]);
  return <>{children}</>;
};
