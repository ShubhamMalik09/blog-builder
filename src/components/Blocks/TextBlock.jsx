import { styles } from '@/lib/data';
import { getDefaultContent } from '@/lib/utils';
import React from 'react'

const TextBlock = ({ block, updateBlock, addBlock }) => {
    const baseClass ="w-full bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-400 break-words whitespace-pre-wrap overflow-hidden";

    const handleKeyDown = (e, block) => {
        if (block.type === "code" || block.type === "image" || block.type == 'video' || block.type === 'list') return;
        if (e.key === "Enter") {
            e.preventDefault();
            addBlock(block.type, block.id); 
        }
    };

    const autoResize = (el) => {
        if (!el) return;
        el.style.height = "auto"; 
        el.style.height = el.scrollHeight + "px";
    };

  return (
    <textarea
        id={`block-${block.id}`}
        className={`${baseClass} ${styles[block.type]}`}
        value={block.content}
        onChange={(e) =>{
            updateBlock(block.id, e.target.value)
            autoResize(e.target);
        }}
        onKeyDown={(e) => handleKeyDown(e, block)}
        // rows={block.content.split('\n').length || 1}
        placeholder={getDefaultContent(block.type)}
        ref={(el) => autoResize(el)}
        style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
    />
  )
}

export default TextBlock