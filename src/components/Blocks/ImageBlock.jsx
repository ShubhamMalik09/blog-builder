import React from 'react'

const ImageBlock = ({ block, updateBlock }) => {
  return (
    <div className="w-full">
        {block.content ? (
            <img src={block.content} alt="uploaded" className="rounded-xl max-w-full h-auto" />
        ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl text-gray-500 hover:bg-gray-50">
                <span>Click to upload image</span>
                <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => updateBlock(block.id, reader.result);
                        reader.readAsDataURL(file);
                    }}
                />
            </label>
        )}
    </div>
  )
}

export default ImageBlock