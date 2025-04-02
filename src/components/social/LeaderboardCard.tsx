
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Dog } from "lucide-react";
import { cn } from "@/lib/utils";

type LeaderboardUser = {
  id: string;
  username: string;
  avatarUrl?: string;
  perfectPoops: number;
  rank: number;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
  className?: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ users, className }) => {
  // Function to get appropriate icon based on rank
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center">{rank}</span>;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 bg-secondary/10">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <span>Perfect Poop Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between p-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    <Dog className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <span className="text-amber-600">10/10</span>
                <span className="text-primary font-bold">{user.perfectPoops}</span>
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
