"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TurndownService from "turndown";

// SunEditor MUST be dynamically imported (no SSR support)
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function SunRichEditor({ initialHTML, onSave }) {
  const [html, setHtml] = useState(initialHTML || "");

  const turndown = new TurndownService(); // for optional Markdown export

  const handleSave = () => {
    // HTML output
    const htmlContent = html;

    // convert to Markdown (optional)
    const markdownContent = turndown.turndown(html);

    onSave({
      html: htmlContent,
      markdown: markdownContent,
    });
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <SunEditor
        defaultValue={initialHTML || ""}
        height="400px"
        onChange={(content) => setHtml(content)}
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize"],
            ["bold", "underline", "italic", "strike"],
            ["fontColor", "hiliteColor"],
            ["align", "list", "lineHeight"],
            ["table", "link", "image", "video"],
            ["fullScreen", "codeView"],
          ],
          resizingBar: true,
        }}
      />

      <button
        onClick={handleSave}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
