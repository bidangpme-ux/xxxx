export interface ProgramTarget {
  year: number;
  targetValue: number;
  realizationValue?: number;
  status: 'completed' | 'in_progress' | 'projected' | string;
  growthYoY?: string;
  milestone?: string;
  notes?: string;
}

export type ProgramAccentColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';

export interface FlagshipProgram {
  id: string;
  code: string;
  title: string;
  category: string;
  leadAgency: string;
  unit: string;
  baseline2024: number;
  totalFiveYearTarget: number;
  cagrRate: string;
  accentColor: ProgramAccentColor;
  description: string;
  strategicOutcomes: string[];
  budgetEstimate?: string;
  iconName?: string;
  targets: ProgramTarget[];
}
