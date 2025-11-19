import React from 'react'

const VideoBlock = ({ block, updateBlock }) => {
    const updateVideo = (file) => {
        if (!file) return;

        const url = URL.createObjectURL(file); // 🔥 FAST + NO BASE64
        updateBlock(block.id, url);
    };

    return (
        <div className="w-full">
            {block.content ? (
                <video
                src={block.content}
                controls
                className="rounded-xl max-w-full"
                />
            ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl text-gray-500 hover:bg-gray-50">
                <span>Click to upload video</span>
                <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => updateVideo(e.target.files[0])}
                />
                </label>
            )}
        </div>
    );
}

export default VideoBlock