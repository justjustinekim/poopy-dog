
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, ImageIcon, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StandardPhotoUploadProps {
  previewUrl: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activateCamera: () => void;
  clearPreview: () => void;
  reactivateCamera: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  cameraError: string | null;
  hasPermissions: boolean | null;
  permissionCheckComplete: boolean;
}

const StandardPhotoUpload: React.FC<StandardPhotoUploadProps> = ({
  previewUrl,
  isLoading,
  isSuccess,
  onFileChange,
  activateCamera,
  clearPreview,
  reactivateCamera,
  fileInputRef,
  cameraError,
  hasPermissions,
  permissionCheckComplete
}) => {
  // Function to determine what text to show for camera access
  const getCameraStatusText = () => {
    if (cameraError) return cameraError;
    if (hasPermissions === false) return "Camera access denied. Please check your browser permissions.";
    if (hasPermissions === null && !permissionCheckComplete) return "Checking camera access...";
    return "Take a clear photo of your dog's poop for accurate analysis";
  };

  return (
    <>
      {!previewUrl && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-1">Capture a photo</h3>
          <p className="text-sm text-gray-500 mb-6">
            {getCameraStatusText()}
          </p>
          
          {cameraError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{cameraError}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Button 
              variant="default" 
              className="flex-1 flex items-center justify-center"
              onClick={activateCamera}
              disabled={hasPermissions === false}
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <div className="relative rounded-lg overflow-hidden aspect-video">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="rounded-full bg-green-500 p-3 animate-scale-in">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button onClick={reactivateCamera} disabled={hasPermissions === false}>
              Retake Photo
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StandardPhotoUpload;
