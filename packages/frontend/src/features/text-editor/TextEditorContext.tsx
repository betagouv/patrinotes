import Color from "@tiptap/extension-color";
import { HardBreak } from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Editor, mergeAttributes, Node, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithChildren, createContext } from "react";
import Image from "@tiptap/extension-image";
import { Box, BoxProps } from "@mui/material";
import FontSize from "@tiptap/extension-font-size";

import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { stateReportExtraCss } from "@cr-vif/pdf/constat";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { ColumnExtension } from "@gocapsule/column-extension";
import Link from "@tiptap/extension-link";

export const TextEditorContext = createContext<{ editor: Editor | null }>({
  editor: null,
});

export const TextEditorContextProvider = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  const editor = useEditor({
    autofocus: false,
    editable: true,
    parseOptions: {
      preserveWhitespace: "full",
    },
    extensions: [
      StarterKit.configure({
        codeBlock: false,
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
      ColumnExtension,
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
    return wrapper.firstChild!;
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.innerHTML = node.attrs.html;

      return {
        dom: dom.firstChild!,
        contentDOM: null,
      };
    };
  },
});
