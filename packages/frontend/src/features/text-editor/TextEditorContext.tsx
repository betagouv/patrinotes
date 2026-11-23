import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import HardBreak from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Editor, Node, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithChildren, createContext } from "react";
import Image from "@tiptap/extension-image";
import { Box, BoxProps } from "@mui/material";

import { TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { stateReportExtraCss } from "@patrinotes/pdf/constat";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";

export const TextEditorContext = createContext<{ editor: Editor | null }>({
  editor: null,
});

export const TextEditorContextProvider = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  const editor = useEditor({
    // TipTap 2 behaviour: the toolbar (active marks) and the PDF preview (editor.getHTML()) re-render on each change
    shouldRerenderOnTransaction: true,
    autofocus: false,
    editable: true,
    parseOptions: {
      preserveWhitespace: "full",
    },
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        // added below with their own configuration, as with TipTap 2
        hardBreak: false,
        horizontalRule: false,
        // new in the TipTap 3 starter kit: kept off so that the document (and the PDF) stays the same
        link: false,
        underline: false,
        listKeymap: false,
        trailingNode: false,
        code: {
          HTMLAttributes: {
            class: "inline",
          },
        },
      }),
      Underline.configure({}),
      Color.configure({
        types: ["textStyle"],
      }),
      Image.configure({}),
      Placeholder.configure({}),
      TextStyle.configure({}),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Link.extend({}),
      HardBreak.extend({}),
      CustomHTML,
      //   addKeyboardShortcuts() {
      //     return {
      //       // Enter: () => this.editor.commands.(),
      //       // ShiftEnter: () => this.editor.commands.setHardBreak(),
      //     };
      //   },
      // }),
      // Table.configure({
      //   resizable: true,
      //   allowTableNodeSelection: true,
      //   HTMLAttributes: {
      //     class: "pe-table",
      //   },
      // }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule,
      // The column extension of TipTap 2 (@gocapsule/column-extension) is gone: it could not read columns back from
      // HTML and no command created any. Column blocks of the templates are kept as is by CustomHTML.
    ],
    content: "",
  });

  return (
    <TextEditorContext.Provider value={{ editor }}>
      <Box
        {...props}
        className="text-editor-container"
        sx={{
          p: {
            lineHeight: "1.8rem",
          },

          ...stateReportExtraCss,
        }}
      >
        {children}
      </Box>
    </TextEditorContext.Provider>
  );
};
export const CustomHTML = Node.create({
  name: "customHTML",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      html: {
        default: "",
        parseHTML: (element) => element.outerHTML,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.column-block",
        getAttrs: (element) => {
          return {
            html: element.outerHTML,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = node.attrs.html;
    // the stored HTML starts with an element (div.column-block)
    return wrapper.firstChild as HTMLElement;
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.innerHTML = node.attrs.html;

      return {
        // prosemirror-view >= 1.42 types NodeView.dom as HTMLElement; the stored HTML starts with an element
        dom: dom.firstChild as HTMLElement,
        contentDOM: null,
      };
    };
  },
});
