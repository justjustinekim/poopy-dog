
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PoopColor, PoopConsistency } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useAchievements } from "@/hooks/useAchievements";

const LogEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshAchievements } = useAchievements();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthInsights, setHealthInsights] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    consistency: 'normal' as PoopConsistency,
    color: 'brown' as PoopColor,
    notes: '',
    location: '',
    date: new Date().toISOString(),
  });

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

    // Fetch the existing entry data
    const fetchEntryData = async () => {
      try {
        const { data, error } = await supabase
          .from('poop_entries')
          .select('*')
          .eq('id', entryIdParam)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            consistency: data.consistency || 'normal',
            color: data.color || 'brown',
            notes: data.notes || '',
            location: data.location || '',
            date: data.date || new Date().toISOString(),
          });
          
          setHealthInsights(data.notes);
        }
      } catch (error) {
        console.error("Error fetching entry data:", error);
        toast.error("Failed to load entry data");
      }
    };

    fetchEntryData();
  }, [location, navigate, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      date: new Date(e.target.value).toISOString()
    }));
  };

  const handleFinalizeEntry = async () => {
    if (!entryId || !user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('poop_entries')
        .update({ 
          notes: formData.notes,
          consistency: formData.consistency,
          color: formData.color,
          location: formData.location,
          date: formData.date
        })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Entry finalized successfully!");
      
      // Refresh achievements to check for newly unlocked ones
      refreshAchievements();
      
      // Navigate to dashboard with calendar tab active
      navigate("/dashboard?tab=calendar");
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
            
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Health Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <p className="mt-2 text-sm text-gray-500">Analyzing poop...</p>
                  </div>
                ) : (
                  <p className="text-sm">{healthInsights || "No analysis available"}</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Entry Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date and Time</Label>
                    <Input 
                      id="date" 
                      type="datetime-local" 
                      value={format(new Date(formData.date), "yyyy-MM-dd'T'HH:mm")}
                      onChange={handleDateChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="consistency">Consistency</Label>
                    <Select 
                      value={formData.consistency} 
                      onValueChange={(value) => handleSelectChange("consistency", value)}
                    >
                      <SelectTrigger id="consistency">
                        <SelectValue placeholder="Select consistency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="soft">Soft</SelectItem>
                        <SelectItem value="liquid">Liquid</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select 
                      value={formData.color} 
                      onValueChange={(value) => handleSelectChange("color", value)}
                    >
                      <SelectTrigger id="color">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (optional)</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      placeholder="Where was the sample found?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      placeholder="Any additional observations or notes"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleFinalizeEntry} 
              disabled={isAnalyzing || isUpdating} 
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isUpdating ? "Finalizing..." : "Save Entry"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogEntry;
