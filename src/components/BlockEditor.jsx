'use client'

import { useState, useCallback, useRef } from 'react'
import Block from './Block'
import { generateId } from '@/lib/utils'

export default function BlockEditor({ blogId, setBlocks, blocks }) {
  const [draggedBlock, setDraggedBlock] = useState(null)
  const [showBlockMenu, setShowBlockMenu] = useState(null)
  const containerRef = useRef(null)

  const updateBlock = useCallback((id, content) => {
    const scrollTop = containerRef.current?.scrollTop || 0
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;

        if (typeof b.content === 'object' && b.content !== null) {
          return { ...b, content: { ...b.content, ...content } };
        }
        return { ...b, content };
      })
    );

    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollTop
      }
    })
  }, [setBlocks])

  const deleteBlock = useCallback((id) => {
    if (blocks.length > 1) {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
  }, [blocks.length, setBlocks])

  const addBlock = useCallback((type, afterId) => {
    const newBlock = {
      id: generateId(),
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
  }, [setBlocks])

  const handleDragStart = useCallback((e, block) => {
    setDraggedBlock(block)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e, targetBlock) => {
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
  }, [draggedBlock, setBlocks])

  const duplicateBlock = useCallback((id) => {
  setBlocks((prev) => {
    const index = prev.findIndex((b) => b.id === id);
    const blockToDuplicate = prev[index];
    
    const newBlock = {
      ...blockToDuplicate,
      id: generateId(),
      // Deep copy content if it's an object
      content: typeof blockToDuplicate.content === 'object' 
        ? { ...blockToDuplicate.content } 
        : blockToDuplicate.content
    };
    
    const updated = [...prev];
    updated.splice(index + 1, 0, newBlock);
    return updated;
  });
}, [setBlocks]);

const moveBlockUp = useCallback((id) => {
  setBlocks((prev) => {
    const index = prev.findIndex((b) => b.id === id);
    if (index === 0) return prev; // Already at top
    
    const updated = [...prev];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    return updated;
  });
}, [setBlocks]);

const moveBlockDown = useCallback((id) => {
  setBlocks((prev) => {
    const index = prev.findIndex((b) => b.id === id);
    if (index === prev.length - 1) return prev; // Already at bottom
    
    const updated = [...prev];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    return updated;
  });
}, [setBlocks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-54" ref={containerRef}>
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-2">
          {blocks.map((block) => (
            <Block 
              key={block.id} 
              block={block} 
              deleteBlock={deleteBlock} 
              updateBlock={updateBlock} 
              addBlock={addBlock} 
              duplicateBlock={duplicateBlock}
              moveBlockUp={moveBlockUp}
              moveBlockDown={moveBlockDown}
              isFirst={blocks[0].id === block.id}
              isLast={blocks[blocks.length - 1].id === block.id}
              showBlockMenu={showBlockMenu} 
              setShowBlockMenu={setShowBlockMenu} 
              handleDragOver={handleDragOver} 
              handleDragStart={handleDragStart} 
              handleDrop={handleDrop}
            />
          ))}
        </div>
      </main>
    </div>
  )
}