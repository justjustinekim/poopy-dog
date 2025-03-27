
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Poop, AlertTriangle, Check } from "lucide-react";

interface HealthAssessmentProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

const HealthAssessment: React.FC<HealthAssessmentProps> = ({
  onComplete,
  onSkip
}) => {
  const [consistency, setConsistency] = React.useState("normal");
  const [frequency, setFrequency] = React.useState("normal");
  const [issues, setIssues] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      consistency,
      frequency,
      issues
    });
  };

  const toggleIssue = (issue: string) => {
    setIssues(prev => 
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Poop className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Dog's Digestive Health Check</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Let's understand your dog's current digestive health
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

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
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Common Issues (Select all that apply)</h3>
              
              <div className="space-y-2">
                {[
                  { id: "gas", label: "Excessive Gas/Flatulence" },
                  { id: "allergy", label: "Food Allergies/Sensitivities" },
                  { id: "vomit", label: "Occasional Vomiting" },
                  { id: "bloat", label: "Bloating or Discomfort" },
                  { id: "eating", label: "Eating Non-Food Items" },
                  { id: "none", label: "None of the Above" }
                ].map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center p-3 rounded-md border cursor-pointer ${
                      issues.includes(item.id) ? "bg-primary/10 border-primary" : ""
                    }`}
                    onClick={() => toggleIssue(item.id)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      issues.includes(item.id) ? "border-primary bg-primary/20" : "border-gray-300"
                    }`}>
                      {issues.includes(item.id) && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <Label className="cursor-pointer">{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {(consistency === "loose" || frequency === "high" || frequency === "irregular") && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Health Notice</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Your answers suggest your dog may have digestive issues. Regular tracking can help identify patterns, 
                  but consider consulting with a veterinarian, especially if symptoms are persistent.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip Assessment
          </Button>
          <Button type="submit">
            Complete Assessment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthAssessment;
