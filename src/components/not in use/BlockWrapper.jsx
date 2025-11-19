"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

export default function BlockWrapper() {
  return (
    <NodeViewWrapper
      data-block-wrapper=""
      className="relative border rounded-md p-3 my-4 bg-white flex gap-3"
    >
      {/* DRAG HANDLE */}
      <div className="drag-handle opacity-40 hover:opacity-100" />

      {/* BLOCK CONTENT */}
      <div className="flex-1">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
}
