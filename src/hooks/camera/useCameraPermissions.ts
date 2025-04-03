
import { useState } from "react";

export interface UseCameraPermissionsReturn {
  hasPermissions: boolean | null;
  permissionCheckComplete: boolean;
  cameraError: string | null;
  checkCameraPermissions: () => Promise<boolean>;
}

export const useCameraPermissions = (): UseCameraPermissionsReturn => {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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

  return {
    hasPermissions,
    permissionCheckComplete,
    cameraError,
    checkCameraPermissions
  };
};
