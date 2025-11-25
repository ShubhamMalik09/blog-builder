"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadMedia } from "@/lib/api/uploadMedia";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ImageModal({ open, onClose, onSelect }) {
  const IMAGE_SIZE_IN_MB = 5;
  const MAX_FILE_SIZE = IMAGE_SIZE_IN_MB * 1024 * 1024;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: `Maximum allowed size is ${IMAGE_SIZE_IN_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadMedia(file, (progress) => {
        setUploadProgress(progress);
      });
      
      if(result.data.success){
        onSelect(result.data.data.url);
        onClose();
        setUploadProgress(0);
      } else{
        toast.error("Upload failed", {
          description: result.data.error
        });
      }
    } catch(error){
      console.error(error);
      toast.error("Upload failed", {
        description: error.message
      });
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
          <div className="border-t pt-4">
            <label className="text-sm font-medium">Upload Image</label>

            <label className="cursor-pointer mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg hover:bg-gray-50">
              <span>{isUploading ? "Uploading..." : "Click to Upload"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => handleUpload(e.target.files[0])}
              />
            </label>
            
            {isUploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center text-gray-600">{uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}