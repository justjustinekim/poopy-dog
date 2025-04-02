
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface DigestiveIssuesSectionProps {
  issues: string[];
  toggleIssue: (issue: string) => void;
  customIssue: string;
  setCustomIssue: (value: string) => void;
}

const DigestiveIssuesSection: React.FC<DigestiveIssuesSectionProps> = ({
  issues,
  toggleIssue,
  customIssue,
  setCustomIssue
}) => {
  const issueOptions = [
    { id: "gas", label: "Excessive Gas/Flatulence" },
    { id: "allergy", label: "Food Allergies/Sensitivities" },
    { id: "vomit", label: "Occasional Vomiting" },
    { id: "bloat", label: "Bloating or Discomfort" },
    { id: "eating", label: "Eating Non-Food Items" },
    { id: "other", label: "Other Issue" },
    { id: "none", label: "None of the Above" }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Common Issues (Select all that apply)</h3>
          
          <div className="space-y-2">
            {issueOptions.map(item => (
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
            
            {issues.includes("other") && (
              <Input
                className="mt-2"
                placeholder="Describe the issue"
                value={customIssue}
                onChange={(e) => setCustomIssue(e.target.value)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigestiveIssuesSection;
