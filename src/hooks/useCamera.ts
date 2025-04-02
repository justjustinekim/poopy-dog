
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
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null); // null means "not checked yet"
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);
  const initAttemptedRef = useRef(false);

  // Update preview if initialPhotoUrl changes
  useEffect(() => {
    if (initialPhotoUrl) {
      setPreviewUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl]);

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
  }, [snapchatStyle, isCameraActive, previewUrl]);

  // Make sure to clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraPermissions = async (): Promise<boolean> => {
    try {
      console.log("Checking camera permissions...");
      
      // Check if permissions are already granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      if (cameras.length === 0) {
        console.log("No cameras detected");
        setCameraError("No camera detected on this device");
        setHasPermissions(false);
        setPermissionCheckComplete(true);
        return false;
      }
      
      // Check if any camera has permission
      const hasPermissionAlready = cameras.some(device => device.label !== '');
      
      if (hasPermissionAlready) {
        console.log("Camera permission already granted");
        setHasPermissions(true);
        setCameraError(null);
        setPermissionCheckComplete(true);
        return true;
      }
      
      // If no label is visible, we need to request permission
      try {
        console.log("Requesting camera permission...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // If we get here, permissions are granted
        // Stop this test stream immediately
        stream.getTracks().forEach(track => track.stop());
        
        console.log("Camera permission granted");
        setHasPermissions(true);
        setCameraError(null);
        setPermissionCheckComplete(true);
        return true;
      } catch (err) {
        console.error("Permission request failed:", err);
        setHasPermissions(false);
        setCameraError("Camera access denied. Please check your browser permissions.");
        setPermissionCheckComplete(true);
        return false;
      }
    } catch (err) {
      console.error("Permission check failed:", err);
      setHasPermissions(false);
      setCameraError("Error checking camera permissions: " + (err instanceof Error ? err.message : String(err)));
      setPermissionCheckComplete(true);
      return false;
    }
  };

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
    // Clear any previous errors
    setCameraError(null);
    
    // Don't reactivate if already active
    if (isCameraActive && streamRef.current) {
      console.log("Camera is already active, not reactivating");
      return;
    }
    
    try {
      // Check if we already know we have permissions
      if (hasPermissions === null) {
        const permissionsGranted = await checkCameraPermissions();
        if (!permissionsGranted) {
          console.log("Camera permissions not granted during activation");
          setCameraError("Camera access denied. Please check your browser permissions.");
          return;
        }
      } else if (hasPermissions === false) {
        console.log("Camera permissions already known to be denied");
        setCameraError("Camera access denied. Please check your browser permissions.");
        return;
      }
      
      // First try to get the environment-facing camera (back camera)
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };

      console.log("Getting user media with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Cleanup any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setCameraError("Error starting video stream");
        });
        setIsCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera with environment mode");
      
      // If environment camera fails, try any available camera as fallback
      try {
        console.log("Trying fallback camera mode");
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        
        // Cleanup any existing stream first
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        streamRef.current = fallbackStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(error => {
            console.error("Error playing fallback video:", error);
            setCameraError("Error starting video stream");
          });
          setIsCameraActive(true);
          setCameraError(null);
        }
      } catch (fallbackErr) {
        console.error("Fallback camera also failed:", fallbackErr);
        setCameraError("Camera access failed. Please check your device permissions.");
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
