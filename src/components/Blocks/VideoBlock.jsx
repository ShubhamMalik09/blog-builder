import React from 'react'

const VideoBlock = ({ block, updateBlock }) => {
  const hasVideo = block.content && block.content.startsWith("data:video");

    return (
        <div className="w-full">
            {hasVideo ? (
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
                    onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const base64 = evt.target.result;
                        if (base64 && base64.startsWith("data:video")) {
                        updateBlock(block.id, base64);
                        }
                    };
                    reader.readAsDataURL(file);
                    }}
                />
                </label>
            )}
        </div>
    );
}

export default VideoBlock