
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Challenge } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChallengesProps {
  challenges: Challenge[];
  loading: boolean;
}

const Challenges: React.FC<ChallengesProps> = ({ challenges, loading }) => {
  // Group challenges by type
  const dailyChallenges = challenges.filter(c => c.challengeType === 'daily');
  const weeklyChallenges = challenges.filter(c => c.challengeType === 'weekly');
  const monthlyChallenges = challenges.filter(c => c.challengeType === 'monthly');
  
  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'weekly':
        return <Calendar className="h-4 w-4 mr-1" />;
      case 'monthly':
        return <Award className="h-4 w-4 mr-1" />;
      default:
        return <Award className="h-4 w-4 mr-1" />;
    }
  };
  
  const renderChallengeList = (title: string, challengeList: Challenge[], typeLabel: string) => {
    if (challengeList.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          {getChallengeTypeIcon(typeLabel.toLowerCase())}
          {title}
        </h3>
        
        {challengeList.map(challenge => (
          <Card 
            key={challenge.id} 
            className={cn(
              "transition-all hover:shadow-md",
              challenge.completed ? "border-green-200" : "border-gray-200"
            )}
          >
            <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4">
              <div 
                className={cn(
                  "h-12 w-12 flex items-center justify-center rounded-full text-xl",
                  challenge.completed 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {challenge.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center">
                  {challenge.title}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    +{challenge.points} XP
                  </span>
                </CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress || 0}/{challenge.maxProgress}</span>
                  </div>
                  <Progress 
                    value={((challenge.progress || 0) / challenge.maxProgress) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  {challenge.completed 
                    ? `Completed on ${new Date(challenge.dateCompleted || '').toLocaleDateString()}`
                    : `Ends ${formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true })}`
                  }
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading challenges...</div>;
  }
  
  if (challenges.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Active Challenges</h3>
        <p className="text-gray-500 text-sm">
          There are no active challenges at the moment. Check back soon!
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {renderChallengeList("Daily Challenges", dailyChallenges, "daily")}
      {renderChallengeList("Weekly Challenges", weeklyChallenges, "weekly")}
      {renderChallengeList("Monthly Challenges", monthlyChallenges, "monthly")}
    </div>
  );
};

export default Challenges;
