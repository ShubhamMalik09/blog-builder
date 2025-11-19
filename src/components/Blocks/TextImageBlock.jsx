import React, { useRef, useState } from "react";
import { styles } from "@/lib/data";   
import { getDefaultContent } from "@/lib/utils";
import ImageModal from "../ImageModal";

const TextImageBlock = ({ block, updateBlock }) => {
    const textareaRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const { text = "", image = "" } = block.content || {};

    // Auto-resize textarea
    const autoResize = (el) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const updateText = (value) => {
        updateBlock(block.id, { text: value });
    };

    const updateImage = (url) => {
        updateBlock(block.id, { image: url });
    };


    return (
        <div className="grid grid-cols-2 gap-4 w-full">

            <ImageModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSelect={updateImage}
            />
            {/* LEFT TEXT */}
            <textarea
                ref={(el) => {
                    textareaRef.current = el;
                    autoResize(el);
                }}
                id={`block-${block.id}`}
                className={`w-full bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-400 break-words whitespace-pre-wrap overflow-hidden ${styles["paragraph"]}`}
                value={text}
                onChange={(e) => {
                    updateText(e.target.value);
                    autoResize(e.target);
                }}
                placeholder={getDefaultContent("paragraph")}
                style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            />

            <div className="w-full" onClick={() => setOpenModal(true)}>
                {image ? (
                    <div className="relative group">
                        <img
                        src={image}
                        alt="uploaded"
                        className="rounded-xl max-w-full h-auto"
                        />

                        {/* DELETE BUTTON */}
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateImage("");
                        }}
                        className="absolute top-2 right-2 bg-white/90 w-6 h-6 rounded-full shadow hidden group-hover:block"
                        >
                        ✕
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl text-gray-500 hover:bg-gray-50">
                        <span>Click to add image</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextImageBlock;
