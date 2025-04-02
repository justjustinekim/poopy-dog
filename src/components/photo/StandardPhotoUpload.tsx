
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StandardPhotoUploadProps {
  previewUrl: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activateCamera: () => void;
  clearPreview: () => void;
  reactivateCamera: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const StandardPhotoUpload: React.FC<StandardPhotoUploadProps> = ({
  previewUrl,
  isLoading,
  isSuccess,
  onFileChange,
  activateCamera,
  clearPreview,
  reactivateCamera,
  fileInputRef,
}) => {
  return (
    <>
      {!previewUrl && (
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-1">Capture a photo</h3>
          <p className="text-sm text-gray-500 mb-6">
            Take a clear photo of your dog's poop for accurate analysis
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Button 
              variant="default" 
              className="flex-1 flex items-center justify-center"
              onClick={activateCamera}
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={onFileChange}
            />
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="glass-card p-4">
          <div className="relative rounded-lg overflow-hidden aspect-video">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="rounded-full bg-green-500 p-3 animate-scale-in">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button onClick={reactivateCamera}>
              Retake Photo
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StandardPhotoUpload;
