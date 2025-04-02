
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HealthAssessmentData } from "@/types";
import StoolConsistencySection from "./StoolConsistencySection";
import BowelFrequencySection from "./BowelFrequencySection";
import DigestiveIssuesSection from "./DigestiveIssuesSection";
import HealthWarning from "./HealthWarning";

interface HealthAssessmentFormProps {
  onComplete: (data: HealthAssessmentData) => void;
  onSkip: () => void;
}

const HealthAssessmentForm: React.FC<HealthAssessmentFormProps> = ({
  onComplete,
  onSkip
}) => {
  const [consistency, setConsistency] = useState("normal");
  const [frequency, setFrequency] = useState("normal");
  const [issues, setIssues] = useState<string[]>([]);
  const [customConsistency, setCustomConsistency] = useState("");
  const [customFrequency, setCustomFrequency] = useState("");
  const [customIssue, setCustomIssue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: HealthAssessmentData = {
      consistency,
      frequency,
      issues,
    };
    
    // Add custom values to the data if they exist
    if (consistency === "other" && customConsistency) {
      data.customConsistency = customConsistency;
    }
    
    if (frequency === "other" && customFrequency) {
      data.customFrequency = customFrequency;
    }
    
    if (issues.includes("other") && customIssue) {
      data.customIssue = customIssue;
    }
    
    onComplete(data);
  };

  const toggleIssue = (issue: string) => {
    setIssues(prev => 
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const showHealthWarning = 
    consistency === "loose" || 
    frequency === "high" || 
    frequency === "irregular";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StoolConsistencySection 
        consistency={consistency}
        setConsistency={setConsistency}
        customConsistency={customConsistency}
        setCustomConsistency={setCustomConsistency}
      />
      
      <BowelFrequencySection 
        frequency={frequency}
        setFrequency={setFrequency}
        customFrequency={customFrequency}
        setCustomFrequency={setCustomFrequency}
      />
      
      <DigestiveIssuesSection 
        issues={issues}
        toggleIssue={toggleIssue}
        customIssue={customIssue}
        setCustomIssue={setCustomIssue}
      />

      {showHealthWarning && <HealthWarning />}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onSkip}>
          Skip Assessment
        </Button>
        <Button type="submit">
          Complete Assessment
        </Button>
      </div>
    </form>
  );
};

export default HealthAssessmentForm;
