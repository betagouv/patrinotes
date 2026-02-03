import { useQuery } from "@tanstack/react-query";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@cr-vif/pdf/constat";
import { pdf } from "@react-pdf/renderer";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useUser } from "../../../contexts/AuthContext";
import { useHtmlString } from "./ConstatPdf.hook";

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

const View = (props: StateReportPDFDocumentProps) => {
  const query = useQuery({
    queryKey: ["report-pdf", props.htmlString],
    queryFn: async () => {
      const blob = await pdf(<StateReportPDFDocument {...props} />).toBlob();
      return blob;
    },
    refetchOnWindowFocus: false,
    enabled: !!props.htmlString,
  });

  if (query.isLoading || !query.data)
    return (
      <Center height="100%" mt="100px">
        <Spinner />
      </Center>
    );

  console.log(query.data);

  return <PdfCanvas blob={query.data as Blob} />;
};
