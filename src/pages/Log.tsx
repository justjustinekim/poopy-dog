
// This file handles photo uploading and storage in Supabase
import React, { useState, useEffect } from "react";
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

  // Check authentication status when component mounts
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to upload photos");
      navigate("/auth");
    }
  }, [user, navigate]);

  const handlePhotoCapture = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload photos");
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate a unique filename with user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;
      
      console.log("Uploading file:", filePath);
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('poop_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }
      
      console.log("Upload successful, getting public URL");
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('poop_images')
        .getPublicUrl(filePath);
      
      const imageUrl = urlData.publicUrl;
      console.log("Public URL:", imageUrl);
      
      // Store entry in the database
      const { data: entryData, error: entryError } = await supabase
        .from('poop_entries')
        .insert({
          user_id: user.id,
          dog_id: "default", // This would ideally be selected by the user
          image_path: filePath,
          consistency: "unknown", // These will be updated later
          color: "unknown",
          date: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (entryError) {
        console.error("Entry error:", entryError);
        throw new Error(`Error logging entry: ${entryError.message}`);
      }
      
      console.log("Entry created with ID:", entryData.id);
      toast.success("Photo uploaded successfully!");
      
      // Redirect to the log entry page for analysis
      navigate(`/log-entry?entryId=${entryData.id}&imageUrl=${encodeURIComponent(imageUrl)}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-50">
          <p>You must be logged in to upload photos.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center bg-white dark:bg-gray-50">
        <div className="w-full h-[calc(100vh-6rem)] max-w-md mx-auto">
          <PhotoUpload 
            onPhotoCapture={handlePhotoCapture} 
            className="w-full h-full"
            snapchatStyle={true}
          />
          
          {isUploading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-100 p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
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
