
import React from "react";
import { Upload, X, Check, RotateCcw } from "lucide-react";

interface SnapchatStylePhotoUploadProps {
  isCameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  capturePhoto: () => void;
  clearPreview: () => void;
}

const SnapchatStylePhotoUpload: React.FC<SnapchatStylePhotoUploadProps> = ({
  isCameraActive,
  videoRef,
  previewUrl,
  fileInputRef,
  capturePhoto,
  clearPreview,
}) => {
  return (
    <div className="relative h-full">
      {/* Camera View */}
      {isCameraActive && (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {/* Bottom Controls - Snapchat Style */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6">
            {/* Upload Button (Left) */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-black/40 p-3"
              aria-label="Upload photo"
            >
              <Upload className="h-7 w-7 text-white" />
            </button>
            
            {/* Capture Button (Center) */}
            <button 
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center"
              aria-label="Take photo"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-200"></div>
            </button>
            
            {/* Placeholder for right side to balance layout */}
            <div className="rounded-full bg-black/40 p-3">
              <RotateCcw className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      )}
      
      {/* Preview Screen */}
      {previewUrl && (
        <div className="absolute inset-0 bg-black flex flex-col">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="h-full w-full object-contain flex-1"
          />
          
          {/* Preview Controls */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6">
            <button
              onClick={clearPreview}
              className="rounded-full bg-black/40 p-3"
              aria-label="Retake"
            >
              <X className="h-7 w-7 text-white" />
            </button>
            
            <button
              onClick={() => {/* Already handled */}}
              className="rounded-full bg-green-500 p-4"
              aria-label="Confirm"
            >
              <Check className="h-7 w-7 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnapchatStylePhotoUpload;
