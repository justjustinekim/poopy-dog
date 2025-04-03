
import { useState, useRef, useEffect } from "react";

export interface UsePhotoCaptureReturn {
  previewUrl: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  capturePhoto: () => void;
  clearPreview: () => void;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UsePhotoCaptureProps {
  initialPhotoUrl?: string | null;
  onPhotoCapture: (file: File) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  activateCamera: () => Promise<void>;
  snapchatStyle?: boolean;
}

export const usePhotoCapture = ({
  initialPhotoUrl,
  onPhotoCapture,
  videoRef,
  streamRef,
  activateCamera,
  snapchatStyle = false
}: UsePhotoCaptureProps): UsePhotoCaptureReturn => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview if initialPhotoUrl changes
  useEffect(() => {
    if (initialPhotoUrl) {
      setPreviewUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
    onPhotoCapture(file);
    
    // Show success indicator briefly
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      // Flip horizontally if using front camera (detect by checking facingMode)
      const videoTrack = streamRef.current?.getVideoTracks()[0];
      const settings = videoTrack?.getSettings();
      const isFrontCamera = settings?.facingMode === 'user';
      
      if (isFrontCamera) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Reset transform if we applied one
      if (isFrontCamera) {
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
          handleFile(file);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Re-activate camera in Snapchat style
    if (snapchatStyle) {
      activateCamera();
    }
  };

  return {
    previewUrl,
    isLoading,
    isSuccess,
    fileInputRef,
    handleFileChange,
    capturePhoto,
    clearPreview,
    setPreviewUrl
  };
};
