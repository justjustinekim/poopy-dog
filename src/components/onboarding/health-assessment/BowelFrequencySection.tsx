
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BowelFrequencySectionProps {
  frequency: string;
  setFrequency: (value: string) => void;
  customFrequency: string;
  setCustomFrequency: (value: string) => void;
}

const BowelFrequencySection: React.FC<BowelFrequencySectionProps> = ({
  frequency,
  setFrequency,
  customFrequency,
  setCustomFrequency
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Frequency of Bowel Movements</h3>
          
          <RadioGroup value={frequency} onValueChange={setFrequency}>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="flex flex-col cursor-pointer">
                <span className="font-medium">Low (0-1 times per day)</span>
                <span className="text-sm text-gray-500">Less frequent than normal</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="normal" id="normal-freq" />
              <Label htmlFor="normal-freq" className="flex flex-col cursor-pointer">
                <span className="font-medium">Normal (2-3 times per day)</span>
                <span className="text-sm text-gray-500">Typical for most dogs</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="flex flex-col cursor-pointer">
                <span className="font-medium">High (4+ times per day)</span>
                <span className="text-sm text-gray-500">More frequent than normal</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="irregular" id="irregular" />
              <Label htmlFor="irregular" className="flex flex-col cursor-pointer">
                <span className="font-medium">Irregular / Unpredictable</span>
                <span className="text-sm text-gray-500">Varies significantly day to day</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="other" id="other-frequency" />
              <Label htmlFor="other-frequency" className="flex flex-col cursor-pointer">
                <span className="font-medium">Other</span>
                <span className="text-sm text-gray-500">Different from options above</span>
              </Label>
            </div>
            
            {frequency === "other" && (
              <Input
                className="mt-2"
                placeholder="Describe the frequency"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
              />
            )}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default BowelFrequencySection;
