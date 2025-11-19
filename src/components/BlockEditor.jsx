'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { blocksToMarkdown, markdownToBlocks } from '@/lib/markdown'
import { Button } from './ui/button'
import Block from './Block'
import { getDefaultContent } from '@/lib/utils'
// import { saveBlog, getBlog } from '@/lib/storage'

export default function BlockEditor({ blogId, setBlocks, blocks }) {
  const [draggedBlock, setDraggedBlock] = useState(null)
  const [showBlockMenu, setShowBlockMenu] = useState(null)

  const updateBlock = (id, content) => {
    setBlocks(blocks.map(b => {
      if (b.id !== id) return b;

      // special case: content is an object
      if (typeof b.content === "object" && b.content !== null) {
        return { 
          ...b, 
          content: { 
            ...b.content, 
            ...content 
          }
        };
      }

      // normal blocks (string content)
      return { ...b, content: content };
    }))
  }

  const deleteBlock = (id) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id))
    }
  }

  const addBlock = (type, afterId) => {
    let newBlock;
    if (type === "text-image" || type === "image-text") {
      newBlock = {
        id: Date.now(),
        type,
        content: {
          text: "",
          image: ""
        }
      };
    } 
    else {
      // all normal blocks
      newBlock = {
        id: Date.now(),
        type,
        content: getDefaultContent(type)
      };
    }
    
    const index = blocks.findIndex(b => b.id === afterId)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    setBlocks(newBlocks)
    setShowBlockMenu(false)
  }

  const handleDragStart = (e, block) => {
    setDraggedBlock(block)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetBlock) => {
    e.preventDefault()
    if (!draggedBlock || draggedBlock.id === targetBlock.id) return

    const dragIndex = blocks.findIndex(b => b.id === draggedBlock.id)
    const dropIndex = blocks.findIndex(b => b.id === targetBlock.id)
    
    const newBlocks = [...blocks]
    newBlocks.splice(dragIndex, 1)
    newBlocks.splice(dropIndex, 0, draggedBlock)
    
    setBlocks(newBlocks)
    setDraggedBlock(null)
  }

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