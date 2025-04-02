
import React from "react";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Challenge } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, Calendar, Award, Gift, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ChallengeMeme from "@/components/ChallengeMeme";

interface ChallengeCardProps {
  challenge: Challenge;
  onShareMeme: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onShareMeme }) => {
  return (
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
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-gray-100 text-gray-500 dark:bg-gray-800"
          )}
        >
          {challenge.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-base flex items-center font-semibold">
            {challenge.title}
            <div className="ml-2 flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <Gift className="h-3 w-3 mr-1" />
              <span>{challenge.points} Coins</span>
            </div>
          </h3>
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
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-gray-500">
              {challenge.completed 
                ? `Completed on ${new Date(challenge.dateCompleted || '').toLocaleDateString()}`
                : `Ends ${formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true })}`
              }
            </div>
            
            {challenge.completed && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                    onClick={() => onShareMeme(challenge)}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-0">
                  <ChallengeMeme challenge={challenge} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ChallengeCard;
