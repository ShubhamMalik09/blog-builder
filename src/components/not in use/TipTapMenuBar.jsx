"use client";

export default function TipTapMenuBar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 border p-2 rounded mb-4 bg-white shadow">
      <button
        className="px-2 py-1 border rounded"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>

      <button
        className="px-2 py-1 border rounded"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>

      <button
        className="px-2 py-1 border rounded"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>

      <button
        className="px-2 py-1 border rounded"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>

      <button
        className="px-2 py-1 border rounded"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </button>

      <button
        className="px-2 py-1 border rounded"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </button>

      {/* ADD NEW BLOCK */}
      <button
        className="px-2 py-1 border rounded bg-green-500 text-white ml-auto"
        onClick={() => {
          editor.commands.enter(); // create new paragraph
        }}
      >
        + Add Block
      </button>
    </div>
  );
}
