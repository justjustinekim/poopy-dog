
import React from "react";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/useCamera";
import StandardPhotoUpload from "./photo/StandardPhotoUpload";
import SnapchatStylePhotoUpload from "./photo/SnapchatStylePhotoUpload";
import CameraView from "./photo/CameraView";
import { PhotoUploadProps } from "./photo/types";

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  onPhotoCapture, 
  className, 
  initialPhotoUrl,
  snapchatStyle = false
}) => {
  const {
    previewUrl,
    isLoading,
    isSuccess,
    isCameraActive,
    fileInputRef,
    videoRef,
    handleFileChange,
    activateCamera,
    capturePhoto,
    stopCamera,
    clearPreview,
    reactivateCamera
  } = useCamera({
    initialPhotoUrl,
    onPhotoCapture,
    snapchatStyle
  });

  if (snapchatStyle) {
    return (
      <div className={cn("relative h-full", className)}>
        <SnapchatStylePhotoUpload
          isCameraActive={isCameraActive}
          videoRef={videoRef}
          previewUrl={previewUrl}
          fileInputRef={fileInputRef}
          capturePhoto={capturePhoto}
          clearPreview={clearPreview}
        />
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    );
  }

  // Original non-Snapchat style UI
  return (
    <div className={cn("relative", className)}>
      <StandardPhotoUpload
        previewUrl={previewUrl}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onFileChange={handleFileChange}
        activateCamera={activateCamera}
        clearPreview={clearPreview}
        reactivateCamera={reactivateCamera}
        fileInputRef={fileInputRef}
      />

      {isCameraActive && (
        <CameraView
          videoRef={videoRef}
          capturePhoto={capturePhoto}
          stopCamera={stopCamera}
        />
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PhotoUpload;
