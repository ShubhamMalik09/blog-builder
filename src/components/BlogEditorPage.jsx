"use client";

import { useEffect, useRef, useState } from "react";

import BlockEditor from "@/components/BlockEditor";
import { blocksToMarkdown } from "@/lib/markdown";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Loader, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogEditorPage({ initialBlocks, mode='new', initialTitle}) {
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)
  const [blocks, setBlocks] = useState(initialBlocks);
  const [loading, setLoading] = useState(true);
  const blocksRef = useRef(blocks);

  const markdown = blocksToMarkdown(blocks);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    if( mode !== 'mew') return;
    const interval = setInterval(() => {
      localStorage.setItem("stored-draft", JSON.stringify(blocksRef.current));
    }, 5 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ( mode === 'new' && localStorage.getItem("stored-draft")) {
      const storedBlocks = JSON.parse(localStorage.getItem("stored-draft"));
      if (storedBlocks?.length > 0) {
        setBlocks(storedBlocks);
      }
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    setIsSaving(true)
    const markdown = blocksToMarkdown(blocks)
    const id = blogId === 'new' ? Date.now().toString() : blogId
    
    // saveBlog(id, title, blocks, markdown)
    
    setTimeout(() => {
      setIsSaving(false)
      if (blogId === 'new') {
        router.push(`/editor/${id}`)
      }
    }, 500)
  }

  return (
    <div className="flex flex-col w-full p-2">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 px-4">
            <div className="w-full mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold text-black">
                      Wokelo Blog Builder
                    </h1>
                    <div className="flex gap-3">
                      <Button className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:shadow-lg hover:bg-gray-800 cursor-pointer transition-all flex items-center gap-2 disabled:opacity-50" onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-700"
                    placeholder="Blog Title"
                />
            </div>
        </header>
        {loading ? (
            <div className="flex items-center justify-center w-full h-screen">
                <Loader size={40}/>
            </div>
        ) : (
            <div className="flex w-full">
                <div className={`overflow-y-auto transition-all duration-300 w-1/2 border-r border-gray-200`}>
                    <BlockEditor blocks={blocks} setBlocks={setBlocks} />
                </div>

                <div className="w-1/2 overflow-y-auto bg-white">
                    <MarkdownPreview markdown={markdown} />
                </div>
            </div>
        )}
    </div>
  );
}
