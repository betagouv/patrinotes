import { useQuery } from "@tanstack/react-query";
import { useConstatPdfContext } from "./ConstatPdfContext";
import { getStateReportHtmlString, StateReportPDFDocument, StateReportPDFDocumentProps } from "@patrinotes/pdf/constat";
import { pdf } from "@react-pdf/renderer";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { PdfCanvas } from "../../../routes/pdf.$reportId";
import { useUser } from "../../../contexts/AuthContext";
import { TextEditor } from "../../text-editor/TextEditor";
import { useContext, useEffect, useRef } from "react";
import { TextEditorContext } from "../../text-editor/TextEditorContext";
export const EditConstatPdf = () => {
  const { localHtmlString } = useConstatPdfContext()!;
  const user = useUser()!;
  const isSetRef = useRef(false);
  const { editor } = useContext(TextEditorContext);

  useEffect(() => {
    if (!editor) return;
    if (isSetRef.current) return;
    if (!localHtmlString) return;

    editor.commands.setContent(localHtmlString);
    isSetRef.current = true;
  }, [editor, localHtmlString]);

  return (
    <Center>
      <Center width="800px" flexDirection="column">
        <TextEditor />
      </Center>
    </Center>
  );
};
