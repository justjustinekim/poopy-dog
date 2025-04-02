
import React, { useEffect } from "react";
import { X, RotateCcw, Upload } from "lucide-react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  capturePhoto: () => void;
  stopCamera: () => void;
  isSnapchatStyle?: boolean;
  onSelectFromGallery?: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  capturePhoto, 
  stopCamera,
  isSnapchatStyle = false,
  onSelectFromGallery
}) => {
  // Add fullscreen capability
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('click', () => {
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen().catch(err => {
            console.log("Error attempting to enable fullscreen:", err);
          });
        }
      });
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('click', () => {});
      }
    };
  }, [videoRef]);

  return (
    <div className={`${isSnapchatStyle ? 'absolute inset-0' : 'fixed inset-0 z-[100]'} bg-black`}>
      <video
        ref={videoRef}
        className={`${isSnapchatStyle ? '' : 'absolute'} inset-0 w-full h-full object-cover`}
        autoPlay
        playsInline
        muted
      />
      
      {/* If in Snapchat style, show the Snapchat-style controls */}
      {isSnapchatStyle ? (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6">
          {/* Upload Button (Left) */}
          <button 
            onClick={onSelectFromGallery}
            className="rounded-full bg-black/40 p-3 text-white"
            aria-label="Upload photo"
          >
            <Upload className="h-7 w-7" />
          </button>
          
          {/* Capture Button (Center) */}
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center transform transition-transform active:scale-95"
            aria-label="Take photo"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gray-200"></div>
          </button>
          
          {/* Switch camera button (placeholder) */}
          <button
            className="rounded-full bg-black/40 p-3 text-white"
            aria-label="Switch camera"
          >
            <RotateCcw className="h-7 w-7" />
          </button>
        </div>
      ) : (
        // Standard camera controls for non-Snapchat style
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-lg transform transition-transform active:scale-95"
            aria-label="Take photo"
          >
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>
        </div>
      )}
      
      {/* Close button - only show in standard mode */}
      {!isSnapchatStyle && (
        <button
          onClick={stopCamera}
          className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white"
          aria-label="Close camera"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default CameraView;
