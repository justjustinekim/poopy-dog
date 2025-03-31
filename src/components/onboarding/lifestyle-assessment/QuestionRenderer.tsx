
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Question } from "./types";

interface QuestionRendererProps {
  question: Question;
  answers: Record<string, any>;
  selectedOptions: string[];
  onRadioChange: (value: string) => void;
  onSliderChange: (value: number[]) => void;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (option: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answers,
  selectedOptions,
  onRadioChange,
  onSliderChange,
  onTextareaChange,
  onInputChange,
  onCheckboxChange
}) => {
  switch (question.type) {
    case "radio":
      return (
        <RadioGroup
          value={answers[question.id] || ""}
          onValueChange={onRadioChange}
          className="space-y-3 mt-4"
        >
          {question.options?.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onRadioChange(option.value)}
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
            defaultValue={[question.defaultValue || 0]}
            max={question.max || 100}
            min={question.min || 0}
            step={question.step || 1}
            onValueChange={onSliderChange}
          />
          <div className="flex justify-between items-center">
            <span>Min: {question.min}</span>
            <span className="text-lg font-medium">
              {question.valueLabel && question.valueLabel(answers[question.id] || question.defaultValue || 0)}
            </span>
            <span>Max: {question.max}</span>
          </div>
        </div>
      );

    case "textarea":
      return (
        <Textarea
          value={answers[question.id] || ""}
          onChange={onTextareaChange}
          placeholder="Type your answer here..."
          className="mt-4"
          rows={5}
        />
      );

    case "input":
      return (
        <Input
          value={answers[question.id] || ""}
          onChange={onInputChange}
          placeholder="Type your answer here..."
          className="mt-4"
        />
      );

    case "multiCheckbox":
      return (
        <div className="space-y-3 mt-4">
          {question.options?.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onCheckboxChange(option.value)}
            >
              <Checkbox
                id={option.value}
                checked={selectedOptions.includes(option.value)}
                onCheckedChange={() => onCheckboxChange(option.value)}
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

export default QuestionRenderer;
