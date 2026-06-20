import { ReminderType } from './report';

export interface Reminder {
  id: string;
  reportId: string;
  reportTypeLabel: string;
  clinicName: string;
  doctorName: string;
  type: ReminderType;
  typeLabel: string;
  date: string;
  note: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'done';
}
