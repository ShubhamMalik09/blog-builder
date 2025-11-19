"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from "react";

export default function BlockWrapper({ editor, node, getPos }) {
  const moveBlock = (dir) => {
    const pos = getPos();
    if (pos == null) return;

    const doc = editor.state.doc;
    const nodes = [];
    doc.forEach((child, offset) => nodes.push({ pos: offset + 1, node: child }));

    const index = nodes.findIndex((n) => n.pos === pos);
    if (index === -1) return;

    let targetIndex = dir === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nodes.length) return;

    const tr = editor.state.tr;

    // remove current node
    const nodeSize = node.nodeSize;
    tr.delete(pos, pos + nodeSize);

    // recompute nodes after deletion
    const newNodes = [];
    tr.doc.forEach((child, offset) => newNodes.push({ pos: offset + 1, node: child }));

    // insert at new position
    const insertPos =
      targetIndex >= newNodes.length
        ? tr.doc.content.size
        : newNodes[targetIndex].pos;

    tr.insert(insertPos, node.type.create(node.attrs, node.content, node.marks));
    editor.view.dispatch(tr.scrollIntoView());
  };

  return (
    <NodeViewWrapper className="relative group border rounded-md p-3 my-4 bg-white flex gap-2">
      {/* Drag handle */}
      <div
        data-drag-handle
        className="drag-handle opacity-20 group-hover:opacity-100"
      />

      {/* Up/Down Buttons */}
      <div className="flex flex-col items-center gap-1 pr-2 opacity-20 group-hover:opacity-100">
        <button onClick={() => moveBlock("up")} className="bg-gray-200 w-6 h-6 rounded">▲</button>
        <button onClick={() => moveBlock("down")} className="bg-gray-200 w-6 h-6 rounded">▼</button>
      </div>

      {/* Content */}
      <div className="flex-1">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
}
