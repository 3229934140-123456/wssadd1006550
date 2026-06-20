export type ReportType = 'panoramic' | 'periapical' | 'cbct';

export type Severity = 'normal' | 'mild' | 'moderate' | 'severe';

export type ReminderType = 'one_week' | 'three_months' | 'pre_implant';

export interface Finding {
  id: string;
  toothPosition: string;
  medicalTerm: string;
  plainExplanation: string;
  severity: Severity;
}

export interface ExamInfo {
  type: ReportType;
  typeLabel: string;
  area: string;
  description: string;
}

export interface ReminderInfo {
  type: ReminderType;
  typeLabel: string;
  date: string;
  note: string;
}

export interface DentalReport {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  clinicName: string;
  doctorName: string;
  reportDate: string;
  reportType: ReportType;
  reportTypeLabel: string;
  examInfo: ExamInfo;
  findings: Finding[];
  recommendations: string[];
  reminder?: ReminderInfo;
  affectedTeeth: string[];
  status: 'published' | 'viewed';
  shareLink?: string;
  shareExpiry?: string;
}
