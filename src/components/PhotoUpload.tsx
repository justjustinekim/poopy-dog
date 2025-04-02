
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Image as ImageIcon, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  onPhotoCapture: (file: File) => void;
  className?: string;
  initialPhotoUrl?: string | null;
  snapchatStyle?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  onPhotoCapture, 
  className, 
  initialPhotoUrl,
  snapchatStyle = false
}) => {
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
  }, [snapchatStyle]);

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

  if (snapchatStyle) {
    return (
      <div className={cn("relative h-full", className)}>
        {/* Camera View */}
        {isCameraActive && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Bottom Controls - Snapchat Style */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6">
              {/* Upload Button (Left) */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-black/40 p-3"
                aria-label="Upload photo"
              >
                <Upload className="h-7 w-7 text-white" />
              </button>
              
              {/* Capture Button (Center) */}
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center"
                aria-label="Take photo"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gray-200"></div>
              </button>
              
              {/* Placeholder for right side to balance layout */}
              <div className="rounded-full bg-black/40 p-3">
                <RotateCcw className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        )}
        
        {/* Preview Screen */}
        {previewUrl && (
          <div className="absolute inset-0 bg-black flex flex-col">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-full w-full object-contain flex-1"
            />
            
            {/* Preview Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6">
              <button
                onClick={clearPreview}
                className="rounded-full bg-black/40 p-3"
                aria-label="Retake"
              >
                <X className="h-7 w-7 text-white" />
              </button>
              
              <button
                onClick={() => {/* Already handled */}}
                className="rounded-full bg-green-500 p-4"
                aria-label="Confirm"
              >
                <Check className="h-7 w-7 text-white" />
              </button>
            </div>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    );
  }

  // Original non-Snapchat style UI
  return (
    <div className={cn("relative", className)}>
      {!isCameraActive && !previewUrl && (
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-1">Capture a photo</h3>
          <p className="text-sm text-gray-500 mb-6">
            Take a clear photo of your dog's poop for accurate analysis
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Button 
              variant="default" 
              className="flex-1 flex items-center justify-center"
              onClick={activateCamera}
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
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {isCameraActive && (
        <div className="fixed inset-0 z-[100] bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
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
          
          <button
            onClick={stopCamera}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white"
            aria-label="Close camera"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {previewUrl && (
        <div className="glass-card p-4">
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
            <Button onClick={() => {
              setPreviewUrl(null);
              activateCamera();
            }}>
              Retake Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
