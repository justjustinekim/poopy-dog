
import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import PhotoUpload from "@/components/PhotoUpload";

const Log = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handlePhotoCapture = (file: File) => {
    // When the PhotoUpload component captures a photo
    console.log("Photo captured:", file);
  };

  const handleReset = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[448px] mx-auto pt-12 md:pt-48 px-4">
        <h1 className="text-2xl font-bold mb-6">Log a Poop</h1>
        
        {/* Use existing PhotoUpload component which has better mobile capture support */}
        <PhotoUpload onPhotoCapture={handlePhotoCapture} />
        
        {/* This is a fallback option but the PhotoUpload component above handles everything better */}
        <div className="hidden">
          <div className="mt-6 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
              <label htmlFor="poop-photo" className="flex flex-col items-center justify-center cursor-pointer">
                <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Upload a photo or take one now</span>
                </div>
                <Input
                  id="poop-photo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Selected poop" 
                    className="w-full h-auto rounded-md object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Retake/Upload New
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Log;
