"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/lib/api/uploadMedia";

export default function VideoModal({ open, onClose, onSelect }) {
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file) => {
      setIsUploading(true);
      try{
        const result = await uploadMedia(file);
        if(result.data.success){
          onSelect(url);
          onClose();
        } else{
          window.alert(`unable to upload media ${result.data.error}`);
        }
      } catch(error){
        window.alert(`error uploading image ${error.message}`);
      } finally{
        setIsUploading(false);
      }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Enter URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Video URL</label>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
            <Button
              onClick={() => {
                if (urlInput.trim()) {
                  onSelect(urlInput.trim());
                  onClose();
                }
              }}
            >
              Use URL
            </Button>
          </div>

          <div className="border-t pt-4">
            <label className="text-sm font-medium">Or Upload Video</label>

            <label className="cursor-pointer mt-2 flex items-center justify-center 
                              border-2 border-dashed border-gray-300 p-4 rounded-lg 
                              hover:bg-gray-50">
              <span>{isUploading ? "Uploading..." : "Click to Upload"}</span>

              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
