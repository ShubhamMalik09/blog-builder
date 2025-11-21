'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { blocksToMarkdown, markdownToBlocks } from '@/lib/markdown'
import { Button } from './ui/button'
import Block from './Block'
import { generateId, getDefaultContent } from '@/lib/utils'
// import { saveBlog, getBlog } from '@/lib/storage'

export default function BlockEditor({ blogId, setBlocks, blocks }) {
  const [draggedBlock, setDraggedBlock] = useState(null)
  const [showBlockMenu, setShowBlockMenu] = useState(null)

  const updateBlock = (id, content) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;

        if (typeof b.content === 'object' && b.content !== null) {
          return { ...b, content: { ...b.content, ...content } };
        }
        return { ...b, content };
      })
    );
  }

  const deleteBlock = (id) => {
    if (blocks.length > 1) {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
  }

    const addBlock = (type, afterId) => {
      const newBlock = {
        id: generateId(), // 🔥 stable UUID
        type,
        content:
          type === 'text-image' || type === 'image-text'
            ? { text: '', image: '' }
            : '',
      };

      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === afterId);
        const updated = [...prev];
        updated.splice(index + 1, 0, newBlock);
        return updated;
      });
      setShowBlockMenu(null);
    };


  const handleDragStart = (e, block) => {
    setDraggedBlock(block)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetBlock) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock.id === targetBlock.id) return;

    setBlocks((prev) => {
      const updated = [...prev];
      const fromIndex = updated.findIndex((b) => b.id === draggedBlock.id);
      const toIndex = updated.findIndex((b) => b.id === targetBlock.id);

      updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, draggedBlock);

      return updated;
    });

    setDraggedBlock(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-2">
          {blocks.map((block) => (
            <Block key={block.id} block={block} deleteBlock={deleteBlock} updateBlock={updateBlock} addBlock={addBlock} showBlockMenu={showBlockMenu} setShowBlockMenu={setShowBlockMenu} handleDragOver={handleDragOver} handleDragStart={handleDragStart} handleDrop={handleDrop}/>
          ))}
        </div>
      </main>
    </div>
  )
}