
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Dog, BowlFood, Heart, Clock, MapPin, Utensils, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Trophy } from "lucide-react";

interface LifestyleAssessmentProps {
  dogName: string;
  onComplete: (data: any) => void;
  onSkip: () => void;
}

const LifestyleAssessment: React.FC<LifestyleAssessmentProps> = ({
  dogName,
  onComplete,
  onSkip,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dogNameDisplay = dogName || "your dog";

  // Fun emojis to use in questions
  const emojis = ["🐕", "🦴", "🥩", "🥬", "🛏️", "🏞️", "🎾", "⛹️‍♂️", "🚶‍♀️", "🏃‍♀️"];

  const questions = [
    {
      id: "walkFrequency",
      question: `${emojis[0]} How often do you walk ${dogNameDisplay}?`,
      type: "radio",
      options: [
        { value: "multipleDaily", label: "Multiple times a day", emoji: "🏃‍♀️" },
        { value: "daily", label: "Once a day", emoji: "🚶‍♀️" },
        { value: "fewTimesWeek", label: "A few times a week", emoji: "🌅" },
        { value: "weekly", label: "Once a week", emoji: "📅" },
        { value: "rarely", label: "Rarely", emoji: "🙈" },
      ],
      hint: "Regular exercise helps maintain healthy digestion",
    },
    {
      id: "exerciseTime",
      question: `${emojis[1]} On average, how much exercise does ${dogNameDisplay} get each day?`,
      type: "slider",
      min: 0,
      max: 180,
      step: 15,
      defaultValue: 30,
      valueLabel: (val: number) => `${val} minutes`,
      hint: "Exercise helps with digestion and overall health",
    },
    {
      id: "foodType",
      question: `${emojis[2]} What type of food does ${dogNameDisplay} eat? (Select all that apply)`,
      type: "multiCheckbox",
      options: [
        { value: "dryKibble", label: "Dry kibble", emoji: "🥫" },
        { value: "wetFood", label: "Wet food", emoji: "🍲" },
        { value: "rawDiet", label: "Raw diet", emoji: "🥩" },
        { value: "homemade", label: "Homemade food", emoji: "👨‍🍳" },
        { value: "treats", label: "Lots of treats", emoji: "🦴" },
        { value: "tableScraps", label: "Table scraps", emoji: "🍗" },
      ],
      hint: "Diet directly impacts stool quality and digestive health",
    },
    {
      id: "supplements",
      question: `${emojis[3]} Do you give ${dogNameDisplay} any supplements?`,
      type: "multiCheckbox",
      options: [
        { value: "probiotics", label: "Probiotics", emoji: "🦠" },
        { value: "omega", label: "Omega fatty acids", emoji: "🐟" },
        { value: "jointSupport", label: "Joint supplements", emoji: "🦵" },
        { value: "vitaminsMinerals", label: "Vitamins/minerals", emoji: "💊" },
        { value: "fiber", label: "Fiber supplements", emoji: "🌾" },
        { value: "none", label: "No supplements", emoji: "❌" },
      ],
      hint: "Some supplements can help improve gut health",
    },
    {
      id: "sleepLocation",
      question: `${emojis[4]} Where does ${dogNameDisplay} usually sleep?`,
      type: "radio",
      options: [
        { value: "ownBed", label: "Dog bed", emoji: "🛏️" },
        { value: "yourBed", label: "Your bed", emoji: "👤" },
        { value: "crate", label: "Crate", emoji: "📦" },
        { value: "couch", label: "Couch", emoji: "🛋️" },
        { value: "floor", label: "Floor", emoji: "⬇️" },
        { value: "outside", label: "Outside", emoji: "🏡" },
      ],
      hint: "Sleep quality can affect overall health including digestion",
    },
    {
      id: "environment",
      question: `${emojis[5]} What type of environment does ${dogNameDisplay} spend most time in?`,
      type: "radio",
      options: [
        { value: "apartment", label: "Apartment", emoji: "🏢" },
        { value: "houseSmallYard", label: "House with small yard", emoji: "🏡" },
        { value: "houseLargeYard", label: "House with large yard", emoji: "🏞️" },
        { value: "farm", label: "Farm/large property", emoji: "🌾" },
        { value: "urban", label: "Urban environment", emoji: "🏙️" },
      ],
      hint: "Environment can impact activity levels and exposure to various bacteria",
    },
    {
      id: "stress",
      question: `${emojis[6]} How would you rate ${dogNameDisplay}'s stress/anxiety levels?`,
      type: "slider",
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 3,
      valueLabel: (val: number) => {
        if (val <= 3) return "Very calm";
        if (val <= 6) return "Somewhat anxious";
        return "Very anxious";
      },
      hint: "Stress can significantly impact digestive health",
    },
    {
      id: "waterConsumption",
      question: `${emojis[7]} How would you describe ${dogNameDisplay}'s water drinking habits?`,
      type: "radio",
      options: [
        { value: "veryLittle", label: "Drinks very little", emoji: "💧" },
        { value: "adequate", label: "Drinks adequate amount", emoji: "🚰" },
        { value: "excessive", label: "Drinks excessively", emoji: "🌊" },
        { value: "inconsistent", label: "Inconsistent", emoji: "🔄" },
      ],
      hint: "Hydration is crucial for gut health and stool consistency",
    },
    {
      id: "grooming",
      question: `${emojis[8]} How often do you groom ${dogNameDisplay}?`,
      type: "radio",
      options: [
        { value: "daily", label: "Daily", emoji: "📆" },
        { value: "weekly", label: "Weekly", emoji: "🗓️" },
        { value: "monthly", label: "Monthly", emoji: "📅" },
        { value: "rarely", label: "Rarely", emoji: "❌" },
        { value: "professional", label: "Professional groomer only", emoji: "💇‍♀️" },
      ],
      hint: "Regular grooming helps prevent ingestion of fur which can cause digestive issues",
    },
    {
      id: "additionalInfo",
      question: `${emojis[9]} Anything else you'd like to share about ${dogNameDisplay}'s lifestyle?`,
      type: "textarea",
      hint: "Any additional details that might be relevant to digestive health",
    },
  ];

  const handleNext = () => {
    // Check if current question has been answered
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id] && currentQuestion.type !== "multiCheckbox" && currentQuestion.type !== "textarea") {
      toast.error("Please answer the question before proceeding");
      return;
    }

    if (currentQuestion.type === "multiCheckbox" && selectedOptions.length === 0) {
      toast.error("Please select at least one option");
      return;
    }

    // If it's the last question, complete the assessment
    if (currentQuestionIndex === questions.length - 1) {
      const achievementUnlocked = Math.random() > 0.5;
      
      if (achievementUnlocked) {
        toast.success("Achievement Unlocked: Lifestyle Guru! 🏆", {
          description: "You've shared detailed information about your dog's lifestyle!"
        });
      }
      
      onComplete(answers);
    } else {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRadioChange = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value,
    });
  };

  const handleSliderChange = (value: number[]) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value[0],
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: e.target.value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: e.target.value,
    });
  };

  const handleCheckboxChange = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(updatedOptions);
    
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: updatedOptions,
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case "radio":
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={handleRadioChange}
            className="space-y-3 mt-4"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRadioChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <label htmlFor={option.value} className="flex flex-1 items-center justify-between cursor-pointer">
                  <span className="text-base">{option.label}</span>
                  {option.emoji && <span className="text-xl">{option.emoji}</span>}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case "slider":
        return (
          <div className="space-y-6 mt-8">
            <Slider
              defaultValue={[currentQuestion.defaultValue]}
              max={currentQuestion.max}
              min={currentQuestion.min}
              step={currentQuestion.step}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between items-center">
              <span>Min: {currentQuestion.min}</span>
              <span className="text-lg font-medium">
                {currentQuestion.valueLabel(answers[currentQuestion.id] || currentQuestion.defaultValue)}
              </span>
              <span>Max: {currentQuestion.max}</span>
            </div>
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={answers[currentQuestion.id] || ""}
            onChange={handleTextareaChange}
            placeholder="Type your answer here..."
            className="mt-4"
            rows={5}
          />
        );

      case "input":
        return (
          <Input
            value={answers[currentQuestion.id] || ""}
            onChange={handleInputChange}
            placeholder="Type your answer here..."
            className="mt-4"
          />
        );

      case "multiCheckbox":
        return (
          <div className="space-y-3 mt-4">
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleCheckboxChange(option.value)}
              >
                <Checkbox
                  id={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={() => handleCheckboxChange(option.value)}
                />
                <label htmlFor={option.value} className="flex flex-1 items-center justify-between cursor-pointer">
                  <span className="text-base">{option.label}</span>
                  {option.emoji && <span className="text-xl">{option.emoji}</span>}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Trophy className="h-10 w-10 text-amber-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Lifestyle Quiz</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Let's learn more about {dogNameDisplay}'s day-to-day life to provide better health insights
        </p>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Question {currentQuestionIndex + 1}/{questions.length}</span>
          <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
        </div>
      </div>

      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">{currentQuestion.question}</h2>
          {currentQuestion.hint && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{currentQuestion.hint}</p>
          )}

          {renderQuestionContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </Button>
            
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                onClick={onSkip}
                size="sm"
              >
                Skip Assessment
              </Button>
              <Button onClick={handleNext}>
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    Complete <Check className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifestyleAssessment;
