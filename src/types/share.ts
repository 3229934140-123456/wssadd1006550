export interface ShareRecord {
  token: string;
  reportId: string;
  clinicName: string;
  reportTypeLabel: string;
  doctorName: string;
  createdAt: string;
  expiryDate: string;
  createdBy: string;
  status: 'active' | 'expired';
}
