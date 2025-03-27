
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement } from "@/types";

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after delay
    if (autoClose) {
      const interval = setInterval(() => {
        setProgressWidth((prev) => {
          const newWidth = prev - (100 / (autoCloseDelay / 100));
          return newWidth > 0 ? newWidth : 0;
        });
      }, 100);
      
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, autoCloseDelay);
      
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [autoClose, autoCloseDelay, onClose]);
  
  return (
    <div 
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 max-w-xs w-full",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      )}
    >
      <Card className="p-4 shadow-xl border-2 border-yellow-300 overflow-hidden bounce-in">
        <div className="flex items-center gap-3">
          <div className="achievement-badge h-12 w-12 flex items-center justify-center">
            <div className="badge-glow"></div>
            <div className="z-10 text-xl">{achievement.icon || "🏆"}</div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
            </div>
            <p className="font-semibold">{achievement.title}</p>
            <p className="text-xs text-gray-600">{achievement.description}</p>
          </div>
          
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        
        {autoClose && (
          <div className="h-1 bg-gray-100 mt-2 rounded overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-100 ease-linear" 
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AchievementPopup;
