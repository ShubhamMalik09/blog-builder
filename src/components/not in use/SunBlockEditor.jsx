"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

export default function SunBlockEditor({ onSave }) {
  const [blocks, setBlocks] = useState([{ id: Date.now(), content: "" }]);
  const [openMenu, setOpenMenu] = useState(null);

  const updateBlock = (id, content) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const addBlock = () => {
    setBlocks((prev) => [...prev, { id: Date.now(), content: "" }]);
  };

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlockUp = (index) => {
    if (index === 0) return;
    setBlocks((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveBlockDown = (index) => {
    if (index === blocks.length - 1) return;
    setBlocks((prev) => {
      const arr = [...prev];
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      return arr;
    });
  };

  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  const handleSave = () => {
    const html = blocks.map((b) => b.content).join("<hr/>");
    onSave(html);
  };

  return (
    <div className="border p-6 rounded bg-white shadow relative">
      <h2 className="text-2xl font-bold mb-4">SunEditor Block Builder</h2>

      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="border bg-gray-50 rounded p-4 relative"
          >
            {/* Block Menu Button */}
            <div className="absolute left-[-45px] top-2">
              <button
                onClick={() => toggleMenu(block.id)}
                className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center text-xl"
              >
                ⠿
              </button>

              {/* Dropdown */}
              {openMenu === block.id && (
                <div className="absolute left-10 top-0 bg-white border shadow-lg rounded p-2 w-32 z-50">
                  <button
                    onClick={() => {
                      moveBlockUp(index);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Move Up
                  </button>

                  <button
                    onClick={() => {
                      moveBlockDown(index);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Move Down
                  </button>

                  <button
                    onClick={() => {
                      deleteBlock(block.id);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* SunEditor Block */}
            <SunEditor
              defaultValue={block.content}
              onChange={(content) => updateBlock(block.id, content)}
              setContents={block.content}
              height="100px"
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  ["bold", "italic", "underline"],
                  ["fontColor", "hiliteColor"],
                  ["align", "list"],
                  ["link", "image", "video"],
                  ["fullScreen", "codeView"],
                ],
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addBlock}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Block
      </button>

      <button
        onClick={handleSave}
        className="mt-4 ml-4 bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
