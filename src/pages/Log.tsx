
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import PhotoUpload from "@/components/PhotoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

const Log = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePhotoCapture = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload photos");
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `public/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('poop_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }
      
      toast.success("Photo uploaded successfully!");
      
      // Redirect to the feed page
      navigate('/social');
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full h-[calc(100vh-6rem)] max-w-md mx-auto">
          <PhotoUpload 
            onPhotoCapture={handlePhotoCapture} 
            className="w-full h-full"
            snapchatStyle={true}
          />
          
          {isUploading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-center">Uploading your photo...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Log;
