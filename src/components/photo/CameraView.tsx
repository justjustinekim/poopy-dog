
import React from "react";
import { X } from "lucide-react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  capturePhoto: () => void;
  stopCamera: () => void;
  isSnapchatStyle?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  capturePhoto, 
  stopCamera,
  isSnapchatStyle = false
}) => {
  return (
    <div className={`${isSnapchatStyle ? 'absolute inset-0' : 'fixed inset-0 z-[100]'} bg-black`}>
      <video
        ref={videoRef}
        className={`${isSnapchatStyle ? '' : 'absolute'} inset-0 w-full h-full object-cover`}
        autoPlay
        playsInline
        muted
      />
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <button 
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-lg transform transition-transform active:scale-95"
          aria-label="Take photo"
        >
          <div className="w-16 h-16 rounded-full bg-white"></div>
        </button>
      </div>
      
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
