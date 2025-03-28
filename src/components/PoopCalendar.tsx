
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, AlertCircle, Search, Camera } from "lucide-react";
import { PoopEntry } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PoopCalendarProps {
  entries: PoopEntry[];
  onDateSelect: (date: Date) => void;
}

const PoopCalendar: React.FC<PoopCalendarProps> = ({ entries, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Create a map of dates to entries for quick lookup
  const entriesByDate: Record<string, PoopEntry[]> = {};
  entries.forEach(entry => {
    const dateKey = entry.date.split('T')[0]; // Convert ISO date to YYYY-MM-DD
    if (!entriesByDate[dateKey]) {
      entriesByDate[dateKey] = [];
    }
    entriesByDate[dateKey].push(entry);
  });
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    onDateSelect(date);
  };
  
  const getEntryForDate = (date: Date): PoopEntry[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return entriesByDate[dateKey] || [];
  };
  
  const selectedDateEntries = selectedDate ? getEntryForDate(selectedDate) : [];
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
          Poop Calendar
        </CardTitle>
        <CardDescription>Track and view your dog's poop history</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-[1fr,auto] gap-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              booked: Object.keys(entriesByDate).map(dateStr => new Date(dateStr)),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "rgba(35, 131, 226, 0.1)",
                color: "hsl(var(--primary))",
              }
            }}
          />
          
          <div className="min-w-[250px] border rounded-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              {selectedDate ? (
                format(selectedDate, "MMMM d, yyyy")
              ) : (
                "Select a date"
              )}
            </h3>
            
            {selectedDateEntries.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEntries.map((entry, index) => (
                  <div key={entry.id} className="p-2 bg-background rounded-md border">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.date), "h:mm a")}
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm">
                      <div className={cn(
                        "w-3 h-3 rounded-full mr-2",
                        entry.consistency === "normal" && "bg-green-500",
                        entry.consistency === "soft" && "bg-yellow-500",
                        entry.consistency === "liquid" && "bg-red-500",
                        entry.consistency === "solid" && "bg-amber-800"
                      )}></div>
                      <span className="capitalize">{entry.consistency}</span>
                      
                      {entry.imageUrl && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="ml-auto">
                                <Camera className="h-4 w-4 text-gray-400" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <div className="w-32 h-32 overflow-hidden rounded-md">
                                <img 
                                  src={entry.imageUrl} 
                                  alt="Poop sample" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    
                    {entry.location && (
                      <div className="mt-1 text-xs flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1 inline" />
                        {entry.location}
                      </div>
                    )}
                    
                    {entry.notes && (
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{entry.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-32 text-gray-400">
                <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">No entries for this date</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoopCalendar;
