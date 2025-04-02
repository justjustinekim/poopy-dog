
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Flame } from "lucide-react";

interface AchievementStatsProps {
  unlockedAchievements: number;
  totalAchievements: number;
  achievementCompletionRate: number;
  streak: number;
  level: number;
  experience: number;
  nextLevelExp: number;
}

const AchievementStats: React.FC<AchievementStatsProps> = ({
  unlockedAchievements,
  totalAchievements,
  achievementCompletionRate,
  streak,
  level,
  experience,
  nextLevelExp
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {unlockedAchievements}/{totalAchievements}
          </div>
          <Progress value={achievementCompletionRate} className="h-2 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-sm">Current Streak</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm">Level {level}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm mt-1">
            {experience}/{nextLevelExp} XP
          </div>
          <Progress 
            value={(experience / nextLevelExp) * 100} 
            className="h-2 mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementStats;
