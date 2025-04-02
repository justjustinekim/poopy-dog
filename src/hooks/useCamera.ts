
import { useState, useRef, useEffect } from "react";

interface UseCameraProps {
  initialPhotoUrl?: string | null;
  onPhotoCapture: (file: File) => void;
  snapchatStyle?: boolean;
}

export const useCamera = ({ 
  initialPhotoUrl, 
  onPhotoCapture, 
  snapchatStyle = false 
}: UseCameraProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Update preview if initialPhotoUrl changes
  useEffect(() => {
    if (initialPhotoUrl) {
      setPreviewUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl]);

  // Auto-activate camera in Snapchat style mode
  useEffect(() => {
    if (snapchatStyle && !isCameraActive && !previewUrl) {
      activateCamera();
    }
  }, [snapchatStyle, isCameraActive, previewUrl]);

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

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions and try again.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
          handleFile(file);
          if (!snapchatStyle) {
            stopCamera();
          }
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
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

  const reactivateCamera = () => {
    setPreviewUrl(null);
    activateCamera();
  };

  return {
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
  };
};
