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

  return (
    <div className="w-full">
        <ImageModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSelect={handleSelect}
        />
        {block.content ? (
            <div className="relative group">
                <img
                    src={block.content}
                    alt="uploaded"
                    className="rounded-xl max-w-full h-auto cursor-pointer"
                    onClick={() => setOpenModal(true)}
                />

                <button
                    onClick={() => updateBlock(block.id, "")}
                    className="absolute top-2 right-2 bg-white/90 w-6 h-6 rounded-full shadow hidden group-hover:block"
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