import { getDefaultContent } from '@/lib/utils'
import { Plus, GripVertical, Trash2, Type, AlignLeft, List, Quote, Code, Save, Eye, ImageIcon, VideoIcon } from 'lucide-react'
import React from 'react'
import TextBlock from './Blocks/TextBlock'
import ImageBlock from './Blocks/ImageBlock'
import VideoBlock from './Blocks/VideoBlock'
import { blockTypes } from '@/lib/data'
import { Button } from './ui/button'
import TextImageBlock from './Blocks/TextImageBlock'
import ImageTextBlock from './Blocks/ImageTextBlock'
import BlockMenu from './BlockMenu'

const Block = ({ block, deleteBlock, addBlock, updateBlock, handleDragStart, handleDragOver, handleDrop, showBlockMenu, setShowBlockMenu }) => {

    const handleFormat = (command) => {
        const isTextObject = typeof block.content === "object";

        const text = isTextObject ? block.content.text : block.content;

        if (!text) return;

        // get where cursor was using DOM
        const textarea = document.getElementById(`block-${block.id}`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const selected = text.substring(start, end);

        if (!selected) return;

        const formatted =
        command === "bold"
            ? `**${selected}**`
            : command === "italic"
            ? `*${selected}*`
            : command === "code"
            ? `\`${selected}\``
            : selected;

        const newText =
        text.substring(0, start) + formatted + text.substring(end);

        if (isTextObject) {
        updateBlock(block.id, { text: newText });
        } else {
        updateBlock(block.id, newText);
        }
    };

    const formatSelectedText  = (text, selectionStart, selectionEnd, command) => {
        const selected = text.substring(selectionStart, selectionEnd);
        const styles = {
            bold: `**${selected}**`,
            italic: `*${selected}*`,
            code: `\`${selected}\``
        };

        const formatted = styles[command] || selected;

        return ( text.substring(0, selectionStart) + formatted + text.substring(selectionEnd) );
    }


    const renderBlock = (block) => {
        switch(block.type){
            case "image":
                return <ImageBlock block={block} updateBlock={updateBlock}/>
            
            case "video":
                return <VideoBlock block={block} updateBlock={updateBlock} />
            
            case "text-image":
                return <TextImageBlock block={block} updateBlock={updateBlock} />;

            case "image-text":
                return <ImageTextBlock block={block} updateBlock={updateBlock} />;
            
            default:
                return <TextBlock block={block} updateBlock={updateBlock} addBlock={addBlock}/>
        }
    }

  return (
    <div
        key={block.id}
        draggable
        onDragStart={(e) => handleDragStart(e, block)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, block)}
        className="group relative"
    >
        <div className="flex flex-col gap-2 bg-gray-50 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200 px-4 py-2 shadow-md hover:shadow-lg">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-full justify-between"> 
                <div className="flex gap-1">
                    <Button size={'icon'} variant={'icon'} className="bg-transparent  hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                    {
                        (block.type !== 'image' && block.type !=='video') && (
                            <>
                                <button
                                    onClick={() => handleFormat('bold')}
                                    className="p-1 hover:bg-gray-100 rounded text-sm font-bold text-gray-600"
                                    title="Bold"
                                >
                                    B
                                </button>
                                <button
                                    onClick={() => handleFormat('italic')}
                                    className="p-1 hover:bg-gray-100 rounded text-sm italic text-gray-600"
                                    title="Italic"
                                >
                                    I
                                </button>
                                <button
                                    onClick={() => handleFormat('code')}
                                    className="p-1 hover:bg-gray-100 rounded text-sm font-mono text-gray-600"
                                    title="Code"
                                >
                                    &lt;&gt;
                                </button>
                            </>
                        )
                    }
                    
                </div>

                <span className='text-sm text-black'>
                    {block.type}
                </span>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        onClick={() => deleteBlock(block.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-500"
                        title="Delete"
                        size={'icon'}
                        variant={'icon'}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="w-full block whitespace-normal">
                {renderBlock(block)}
            </div>
        </div>

        <div className="relative -mt-2 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
                className="absolute bg-white border-2 border-gray-200 rounded-full p-1 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
                <Plus className="w-4 h-4 text-gray-600" />
            </button>

            {showBlockMenu === block.id && (
                <BlockMenu block={block} addBlock={addBlock}/>
                // <div className="absolute top-8 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-10 min-w-[200px]">
                // {blockTypes.map(({ type, icon: Icon, label }) => (
                //     <Button key={type} variant={'ghost'}
                //         onClick={() => addBlock(type, block.id)}
                //         className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors"
                //         >
                //         <Icon className="w-4 h-4 text-gray-600" />
                //         <span className="text-sm font-medium text-gray-700">{label}</span>
                //     </Button>
                // ))}
                // </div>
            )}
        </div>
    </div>
  )
}

export default Block