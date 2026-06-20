export interface TermEntry {
  medicalTerm: string;
  plainExplanation: string;
  category: string;
}

export interface ToothInfo {
  number: string;
  name: string;
  quadrant: 'upper-right' | 'upper-left' | 'lower-left' | 'lower-right';
}
