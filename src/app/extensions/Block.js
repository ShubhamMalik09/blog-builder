import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import BlockWrapper from "../../components/not in use/BlockWrapper";

const Block = Node.create({
  name: "blockWrapper",
  group: "block",
  content: "block+",

  parseHTML() {
    return [{ tag: "div[data-block-wrapper]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-block-wrapper": "" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockWrapper);
  },
});

export default Block;
