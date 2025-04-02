
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

  // Make sure to clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

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
      // First try to get the environment-facing camera (back camera)
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      
      // If environment camera fails, try any available camera as fallback
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        
        streamRef.current = fallbackStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
          });
          setIsCameraActive(true);
        }
      } catch (fallbackErr) {
        console.error("Fallback camera also failed:", fallbackErr);
        alert("Could not access camera. Please check permissions and try again.");
      }
    }
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
