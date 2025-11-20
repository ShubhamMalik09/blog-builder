import React, { useState } from 'react'
import ImageModal from '../ImageModal';

const ImageBlock = ({ block, updateBlock }) => {
    const [openModal, setOpenModal] = useState(false);
    const updateImage = (file) => {
        if (!file) return;

        const url = URL.createObjectURL(file); // FAST + NO BASE64
        updateBlock(block.id, url);
    };

    const handleSelect = (url) => {
        updateBlock(block.id, url);
    };

    const clearImage = () => {
        updateBlock(block.id, "");
    };

  return (
    <div className="w-full">
        <ImageModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSelect={handleSelect}
        />
        {block.content ? (
            <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-xl border">
                <span className="text-sm text-blue-600 underline break-all cursor-pointer"
                        onClick={() => window.open(block.content, "_blank")}>
                    {block.content}
                </span>

                <button
                    onClick={clearImage}
                    className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
                >
                    ✕
                </button>
            </div>
        ) : (
            <label
                onClick={() => setOpenModal(true)}
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl text-gray-500 hover:bg-gray-50"
            >
                <span>Click to add image</span>
            </label>
        )}
    </div>
  )
}

export default ImageBlock