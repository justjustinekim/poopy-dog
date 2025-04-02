
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StoolConsistencySectionProps {
  consistency: string;
  setConsistency: (value: string) => void;
  customConsistency: string;
  setCustomConsistency: (value: string) => void;
}

const StoolConsistencySection: React.FC<StoolConsistencySectionProps> = ({
  consistency,
  setConsistency,
  customConsistency,
  setCustomConsistency
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Stool Consistency</h3>
          
          <RadioGroup value={consistency} onValueChange={setConsistency}>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="solid" id="solid" />
              <Label htmlFor="solid" className="flex flex-col cursor-pointer">
                <span className="font-medium">Solid & Formed</span>
                <span className="text-sm text-gray-500">Easy to pick up, holds shape</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal" className="flex flex-col cursor-pointer">
                <span className="font-medium">Normal</span>
                <span className="text-sm text-gray-500">Well-formed but not too hard</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="soft" id="soft" />
              <Label htmlFor="soft" className="flex flex-col cursor-pointer">
                <span className="font-medium">Soft</span>
                <span className="text-sm text-gray-500">Losing form, still holds together</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="loose" id="loose" />
              <Label htmlFor="loose" className="flex flex-col cursor-pointer">
                <span className="font-medium">Very Loose / Diarrhea</span>
                <span className="text-sm text-gray-500">Watery, no solid form</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="other" id="other-consistency" />
              <Label htmlFor="other-consistency" className="flex flex-col cursor-pointer">
                <span className="font-medium">Other</span>
                <span className="text-sm text-gray-500">Different from options above</span>
              </Label>
            </div>
            
            {consistency === "other" && (
              <Input
                className="mt-2"
                placeholder="Describe the consistency"
                value={customConsistency}
                onChange={(e) => setCustomConsistency(e.target.value)}
              />
            )}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoolConsistencySection;
