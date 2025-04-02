
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/types";
import { Share2, Download, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface ChallengeMemeProps {
  challenge: Challenge;
  onClose?: () => void;
}

const ChallengeMeme: React.FC<ChallengeMemeProps> = ({ challenge, onClose }) => {
  const [liked, setLiked] = useState(false);
  
  // In a real app, these would be dynamically generated based on the challenge
  const topText = `I SURVIVED THE`;
  const bottomText = `${challenge.title} CHALLENGE!`;
  
  const handleShare = async () => {
    try {
      // In a real implementation, you would generate an actual image to share
      if (navigator.share) {
        await navigator.share({
          title: `${challenge.title} Challenge Completed!`,
          text: `I just completed the ${challenge.title} Challenge in my PupPoop app! #PoopChallenge`,
          // url: 'https://yourapp.com/share/123' // Link to a proper sharing page
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback for browsers that don't support the Web Share API
        toast.info("Copy this link to share with friends!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };
  
  const handleDownload = () => {
    // In a real implementation, you would generate and download an actual image
    toast.success("Meme downloaded!");
  };
  
  return (
    <div className="p-4">
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-bold text-center">Challenge Completed!</h3>
          <p className="text-center text-gray-500">Share your achievement</p>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-square">
            {/* This would be a proper meme generator in a real implementation */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-4 text-white">
              <p className="text-xl font-bold uppercase text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {topText}
              </p>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-6xl">{challenge.icon}</div>
              </div>
              
              <p className="text-xl font-bold uppercase text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {bottomText}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setLiked(!liked)}
          >
            <ThumbsUp className="h-4 w-4" color={liked ? "blue" : undefined} />
            <span>{liked ? "Liked" : "Like"}</span>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              <span>Save</span>
            </Button>
            
            <Button 
              size="sm" 
              className="gap-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {onClose && (
        <div className="flex justify-center mt-4">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeMeme;
