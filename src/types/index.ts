
export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
}

export type PoopConsistency = 'solid' | 'soft' | 'liquid' | 'normal';
export type PoopColor = 'brown' | 'green' | 'yellow' | 'red' | 'black' | 'white';

export interface PoopEntry {
  id: string;
  dogId: string;
  date: string;
  imageUrl?: string;
  consistency: PoopConsistency;
  color: PoopColor;
  notes?: string;
  tags?: string[];
  location?: string;
}

export interface HealthInsight {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation?: string;
}
