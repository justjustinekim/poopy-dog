
import { useState, useRef, useEffect } from "react";

export interface UseCameraStreamReturn {
  isCameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  activateCamera: () => Promise<void>;
  stopCamera: () => void;
  cameraError: string | null;
}

export interface UseCameraStreamProps {
  hasPermissions: boolean | null;
}

export const useCameraStream = ({ hasPermissions }: UseCameraStreamProps): UseCameraStreamReturn => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Make sure to clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const activateCamera = async () => {
    // Clear any previous errors
    setCameraError(null);
    
    // Don't reactivate if already active
    if (isCameraActive && streamRef.current) {
      console.log("Camera is already active, not reactivating");
      return;
    }
    
    try {
      // Check permissions first
      if (hasPermissions === false) {
        console.log("Camera permissions denied during activation");
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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  return {
    isCameraActive,
    videoRef,
    streamRef,
    activateCamera,
    stopCamera,
    cameraError
  };
};
