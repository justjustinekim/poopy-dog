
import React from "react";
import { Upload, X, Check, RotateCcw, Camera } from "lucide-react";

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
              className="rounded-full bg-black/40 p-3 text-white"
              aria-label="Upload photo"
            >
              <Upload className="h-7 w-7" />
            </button>
            
            {/* Capture Button (Center) */}
            <button 
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center"
              aria-label="Take photo"
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-200"></div>
            </button>
            
            {/* Switch camera (if on mobile) */}
            <button 
              className="rounded-full bg-black/40 p-3 text-white"
              aria-label="Switch camera"
              onClick={() => {
                // This is a placeholder - actual camera switching is handled in the camera hook
                console.log("Switch camera requested");
              }}
            >
              <RotateCcw className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}
      
      {/* Preview Screen - display captured photo */}
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
              className="rounded-full bg-black/40 p-3 text-white"
              aria-label="Retake"
            >
              <X className="h-7 w-7" />
            </button>
            
            {/* Empty div to center the confirm button */}
            <div className="w-12"></div>
            
            <button
              className="rounded-full bg-green-500 p-4 text-white"
              aria-label="Confirm"
            >
              <Check className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}
      
      {/* Show message when no camera is active and no preview */}
      {!isCameraActive && !previewUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-center p-6">
            <Camera className="h-12 w-12 mx-auto mb-4 text-white" />
            <p className="text-white text-lg mb-6">Camera access required</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black rounded-full px-6 py-3 font-medium"
            >
              Upload a photo instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnapchatStylePhotoUpload;
