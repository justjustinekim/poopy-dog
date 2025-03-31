
export interface LifestyleAssessmentProps {
  dogName: string;
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'radio' | 'slider' | 'multiCheckbox' | 'textarea' | 'input';
  options?: QuestionOption[];
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  valueLabel?: (val: number) => string;
}
