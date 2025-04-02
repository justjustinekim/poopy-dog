
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, AlertCircle } from "lucide-react";
import { Achievement } from "@/types";
import { cn } from "@/lib/utils";

interface AchievementListProps {
  achievements: Achievement[];
  loading: boolean;
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements, loading }) => {
  // Filter achievements by type
  const standardAchievements = achievements.filter(
    a => a.achievementType === 'standard' && !a.isNegative
  );
  const dailyAchievements = achievements.filter(
    a => a.achievementType === 'daily' && !a.isNegative
  );
  const negativeAchievements = achievements.filter(a => a.isNegative);
  
  const renderAchievement = (achievement: Achievement) => (
    <Card 
      key={achievement.id}
      className={cn(
        "transition-all hover:shadow-md",
        achievement.unlocked 
          ? "border-primary/30" 
          : "border-gray-200 opacity-70"
      )}
    >
      <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-3">
        <div 
          className={cn(
            "h-12 w-12 flex items-center justify-center rounded-full text-xl",
            achievement.unlocked 
              ? "bg-primary/10 text-primary" 
              : "bg-gray-100 text-gray-400 dark:bg-gray-800"
          )}
        >
          {achievement.icon || "🏆"}
        </div>
        <div className="flex-1">
          <CardTitle className="text-base">
            {achievement.title}
          </CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
          
          {achievement.maxProgress && achievement.maxProgress > 1 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
              </div>
              <Progress 
                value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                className="h-2" 
              />
            </div>
          )}
          
          {achievement.unlocked && achievement.dateUnlocked && (
            <p className="text-xs text-gray-500 mt-2">
              Unlocked on {new Date(achievement.dateUnlocked).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardHeader>
    </Card>
  );

  if (loading) {
    return <div className="text-center p-8">Loading achievements...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Trophy className="h-4 w-4 mr-2" />
          Standard Achievements
        </h3>
        
        {standardAchievements.length > 0 ? (
          <div className="space-y-4">
            {standardAchievements.map(renderAchievement)}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            No standard achievements available
          </div>
        )}
      </div>
      
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Daily Achievements
        </h3>
        
        {dailyAchievements.length > 0 ? (
          <div className="space-y-4">
            {dailyAchievements.map(renderAchievement)}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            No daily achievements available
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          Setbacks
        </h3>
        
        {negativeAchievements.length > 0 ? (
          <div className="space-y-4">
            {negativeAchievements.map(renderAchievement)}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            No setbacks yet! Keep it up!
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementList;
