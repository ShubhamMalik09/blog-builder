"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/lib/api/uploadMedia";
// import { uploadImageToServer } from "@/lib/upload/uploadImage";

export default function ImageModal({ open, onClose, onSelect }) {
  const IMAGE_SIZE_IN_MB = 5;
  const MAX_FILE_SIZE = IMAGE_SIZE_IN_MB * 1024 * 1024;
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: `Maximum allowed size is ${IMAGE_SIZE_IN_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      });
      return;
    }
    setIsUploading(true);
    try{
      const result = await uploadMedia(file);
      if(result.data.success){
        onSelect(result.data.data.url);
        onClose();
      } else{
        window.alert(`unable to upload media ${result.data.error}`);
      }
    } catch(error){
      console.error(error)
      // window.alert(`error uploading image ${error.message}`);
    } finally{
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Enter Image URL</label>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.png"
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
          </div> */}

          <div className="border-t pt-4">
            <label className="text-sm font-medium">Or Upload Image</label>

            <label className="cursor-pointer mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg hover:bg-gray-50">
              <span>{isUploading ? "Uploading..." : "Click to Upload"}</span>
              <input
                type="file"
                accept="image/*"
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
