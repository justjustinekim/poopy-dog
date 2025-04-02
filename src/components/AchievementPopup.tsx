
import React, { useState, useEffect } from "react";
import { Achievement } from "@/types";
import { Trophy, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation before removing
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const isNegative = achievement.isNegative;
  
  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div 
        className={cn(
          "bg-background border rounded-lg shadow-lg w-full max-w-sm overflow-hidden transform transition-all duration-300 pointer-events-auto",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          isNegative 
            ? "border-red-200" 
            : "border-border"
        )}
      >
        <div className={cn(
          "flex items-center p-4",
          isNegative 
            ? "bg-red-50 dark:bg-red-900/20" 
            : "bg-primary/10"
        )}>
          <div className="flex-shrink-0 mr-3">
            <div className={cn(
              "p-2 rounded-full",
              isNegative 
                ? "bg-red-100/50 dark:bg-red-900/30" 
                : "bg-primary/20"
            )}>
              {achievement.icon ? (
                <span className="text-2xl">{achievement.icon}</span>
              ) : isNegative ? (
                <AlertCircle className="h-6 w-6 text-red-500" />
              ) : (
                <Trophy className="h-6 w-6 text-primary" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">
              {isNegative ? "Setback Occurred!" : "Achievement Unlocked!"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.title}</p>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm">{achievement.description}</p>
          
          {isNegative && achievement.penaltyPoints && (
            <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
              Penalty: -{achievement.penaltyPoints} points
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
