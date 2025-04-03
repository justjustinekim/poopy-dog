
import { useState, useEffect, useRef } from "react";
import { useCameraPermissions } from "./useCameraPermissions";
import { useCameraStream } from "./useCameraStream";
import { usePhotoCapture } from "./usePhotoCapture";

export interface UseCameraProps {
  initialPhotoUrl?: string | null;
  onPhotoCapture: (file: File) => void;
  snapchatStyle?: boolean;
}

export const useCamera = ({
  initialPhotoUrl,
  onPhotoCapture,
  snapchatStyle = false
}: UseCameraProps) => {
  const initAttemptedRef = useRef(false);

  // Use camera permissions hook
  const {
    hasPermissions,
    permissionCheckComplete,
    cameraError: permissionError,
    checkCameraPermissions
  } = useCameraPermissions();

  // Use camera stream hook
  const {
    isCameraActive,
    videoRef,
    streamRef,
    activateCamera,
    stopCamera,
    cameraError: streamError
  } = useCameraStream({ hasPermissions });

  // Combine error states
  const cameraError = permissionError || streamError;

  // Use photo capture hook
  const {
    previewUrl,
    isLoading,
    isSuccess,
    fileInputRef,
    handleFileChange,
    capturePhoto,
    clearPreview
  } = usePhotoCapture({
    initialPhotoUrl,
    onPhotoCapture,
    videoRef,
    streamRef,
    activateCamera,
    snapchatStyle
  });

  // Auto-activate camera in Snapchat style mode
  useEffect(() => {
    if (snapchatStyle && !isCameraActive && !previewUrl && !initAttemptedRef.current) {
      initAttemptedRef.current = true;
      checkCameraPermissions().then(hasAccess => {
        if (hasAccess) {
          activateCamera();
        }
      });
    }
  }, [snapchatStyle, isCameraActive, previewUrl, checkCameraPermissions, activateCamera]);

  const reactivateCamera = () => {
    setPreviewUrl(null);
    activateCamera();
  };

  // Provide the combined interface
  return {
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
  };
};

export * from "./useCameraPermissions";
export * from "./useCameraStream";
export * from "./usePhotoCapture";
