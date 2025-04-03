
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LogEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [healthInsights, setHealthInsights] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to view this page");
      navigate("/auth");
      return;
    }

    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const imageUrlParam = params.get("imageUrl");
    const entryIdParam = params.get("entryId");

    if (!imageUrlParam || !entryIdParam) {
      toast.error("Missing required parameters");
      navigate("/dashboard");
      return;
    }

    setImageUrl(imageUrlParam);
    setEntryId(entryIdParam);

    // Call the Supabase Edge Function to analyze the image
    const analyzeImage = async () => {
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('analyze-poop', {
          body: { imageUrl: imageUrlParam },
        });

        if (error) throw error;
        
        setHealthInsights(data.analysis);
      } catch (error) {
        console.error("Error analyzing image:", error);
        toast.error("Failed to analyze image");
        setHealthInsights("Unable to analyze the image. Please try again later.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeImage();
  }, [location, navigate, user]);

  const handleFinalizeEntry = async () => {
    if (!entryId || !healthInsights || !user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('poop_entries')
        .update({ 
          notes: healthInsights,
          // We could also update consistency and color based on AI analysis
        })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Entry finalized successfully!");
      navigate("/social");
    } catch (error) {
      console.error("Error finalizing entry:", error);
      toast.error("Failed to finalize entry");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!imageUrl || !entryId) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p>Invalid entry parameters</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 bg-white dark:bg-gray-50">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-100 rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Poop Analysis</h2>
            
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
              {imageUrl && <img src={imageUrl} alt="Dog poop" className="w-full h-full object-cover" />}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Health Insights</h3>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <p className="mt-2 text-sm text-gray-500">Analyzing poop...</p>
                </div>
              ) : (
                <p className="text-sm">{healthInsights}</p>
              )}
            </div>
            
            <Button 
              onClick={handleFinalizeEntry} 
              disabled={isAnalyzing || isUpdating} 
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isUpdating ? "Finalizing..." : "Finalize Entry"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogEntry;
