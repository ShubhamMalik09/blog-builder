"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Block from "../app/extensions/Block";
import TipTapMenuBar from "./TipTapMenuBar";
import { useEffect, useRef } from "react";
import Sortable from "sortablejs";

export default function TipTapEditor({ initialContent, onSave }) {
  const editorWrapperRef = useRef(null);

  const editor = useEditor({
    extensions: [
      Block,
      StarterKit,
      Placeholder.configure({ placeholder: "Write your blog..." }),
      Image,
      Youtube,
    ],
    content: initialContent || "<p>Hello</p>",
    immediatelyRender: false,
  });

  // ENABLE DRAG & DROP WITH SORTABLEJS
  useEffect(() => {
    if (!editor) return;

    const container = editorWrapperRef.current?.querySelector(".tiptap");
    if (!container) return;

    Sortable.create(container, {
      animation: 150,
      ghostClass: "drag-ghost",
      handle: ".drag-handle",

      onEnd: (evt) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        if (oldIndex === newIndex) return;

        const doc = editor.state.doc;

        const nodes = [];
        doc.forEach((node, offset) => {
          nodes.push({ node, pos: offset + 1 });
        });

        const tr = editor.state.tr;

        const movingNode = nodes[oldIndex].node;
        const fromPos = nodes[oldIndex].pos;

        tr.delete(fromPos, fromPos + movingNode.nodeSize);

        const newNodes = [];
        tr.doc.forEach((node, offset) => {
          newNodes.push({ node, pos: offset + 1 });
        });

        if (newIndex >= newNodes.length) {
          tr.insert(tr.doc.content.size, movingNode);
        } else {
          tr.insert(newNodes[newIndex].pos, movingNode);
        }

        editor.view.dispatch(tr.scrollIntoView());
      },
    });
  }, [editor]);

  if (!editor) return null;

  return (
    <div ref={editorWrapperRef} className="relative border p-4 rounded">
      {/* TOOLBAR */}
      <TipTapMenuBar editor={editor} />

      {/* EDITOR */}
      <EditorContent editor={editor} />

      {/* CSS */}
      <style jsx global>{`
        .drag-handle {
          width: 20px;
          height: 20px;
          background: #ccc;
          border-radius: 4px;
          cursor: grab;
        }
        .drag-handle:active {
          cursor: grabbing;
        }
        .drag-ghost {
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
}
