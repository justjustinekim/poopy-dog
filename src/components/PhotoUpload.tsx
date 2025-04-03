
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCamera } from "@/hooks/camera";
import StandardPhotoUpload from "./photo/StandardPhotoUpload";
import SnapchatStylePhotoUpload from "./photo/SnapchatStylePhotoUpload";
import CameraView from "./photo/CameraView";
import { PhotoUploadProps } from "./photo/types";
import { toast } from "sonner";

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
    hasPermissions,
    permissionCheckComplete,
    cameraError,
    fileInputRef,
    videoRef,
    handleFileChange,
    activateCamera,
    capturePhoto,
    stopCamera,
    clearPreview,
    reactivateCamera,
    checkCameraPermissions
  } = useCamera({
    initialPhotoUrl,
    onPhotoCapture,
    snapchatStyle
  });

  // Show toast when camera errors occur
  useEffect(() => {
    if (cameraError && permissionCheckComplete) {
      toast.error(cameraError);
    }
  }, [cameraError, permissionCheckComplete]);

  // Handler for when user clicks on gallery/upload option
  const handleSelectFromGallery = () => {
    fileInputRef.current?.click();
  };

  if (snapchatStyle) {
    return (
      <div className={cn("relative h-full", className)}>
        {isCameraActive ? (
          <CameraView
            videoRef={videoRef}
            capturePhoto={capturePhoto}
            stopCamera={stopCamera}
            isSnapchatStyle={true}
            onSelectFromGallery={handleSelectFromGallery}
          />
        ) : (
          <SnapchatStylePhotoUpload
            isCameraActive={isCameraActive}
            videoRef={videoRef}
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            capturePhoto={capturePhoto}
            clearPreview={clearPreview}
            cameraError={cameraError}
            activateCamera={activateCamera}
            hasPermissions={hasPermissions}
            permissionCheckComplete={permissionCheckComplete}
            checkCameraPermissions={checkCameraPermissions}
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
        cameraError={cameraError}
        hasPermissions={hasPermissions}
        permissionCheckComplete={permissionCheckComplete}
      />

      {isCameraActive && (
        <CameraView
          videoRef={videoRef}
          capturePhoto={capturePhoto}
          stopCamera={stopCamera}
          onSelectFromGallery={handleSelectFromGallery}
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
