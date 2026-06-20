import { ShareRecord } from '@/types/share';

let shareRecords: ShareRecord[] = [
  {
    token: 'abc12345',
    reportId: 'RPT001',
    clinicName: '康美口腔门诊部',
    reportTypeLabel: '全景片',
    doctorName: '李明华',
    createdAt: '2026-06-20T10:00:00',
    expiryDate: '2026-06-23T10:00:00',
    createdBy: '张小明',
    status: 'active'
  },
  {
    token: 'def67890',
    reportId: 'RPT003',
    clinicName: '康美口腔门诊部',
    reportTypeLabel: 'CBCT',
    doctorName: '陈建国',
    createdAt: '2026-06-10T10:00:00',
    expiryDate: '2026-06-13T10:00:00',
    createdBy: '张小明',
    status: 'expired'
  },
  {
    token: 'validtest01',
    reportId: 'RPT005',
    clinicName: '康美口腔门诊部',
    reportTypeLabel: 'CBCT',
    doctorName: '王秀英',
    createdAt: '2026-06-19T10:00:00',
    expiryDate: '2026-06-22T10:00:00',
    createdBy: '张小明',
    status: 'active'
  }
];

export function getShareRecord(token: string): ShareRecord | undefined {
  const record = shareRecords.find(r => r.token === token);
  if (!record) return undefined;
  if (record.status === 'active') {
    const now = new Date();
    const exp = new Date(record.expiryDate);
    if (now > exp) {
      record.status = 'expired';
    }
  }
  return record;
}

export function createShareRecord(
  reportId: string,
  clinicName: string,
  reportTypeLabel: string,
  doctorName: string
): ShareRecord {
  const token = Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-2);
  const now = new Date();
  const expiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const record: ShareRecord = {
    token,
    reportId,
    clinicName,
    reportTypeLabel,
    doctorName,
    createdAt: now.toISOString(),
    expiryDate: expiry.toISOString(),
    createdBy: '张小明',
    status: 'active'
  };
  shareRecords.unshift(record);
  console.info('[ShareService] 创建分享记录', { token, reportId });
  return record;
}

export function getAllShareRecords(): ShareRecord[] {
  return shareRecords.map(r => {
    if (r.status === 'active') {
      const now = new Date();
      const exp = new Date(r.expiryDate);
      if (now > exp) {
        return { ...r, status: 'expired' as const };
      }
    }
    return r;
  });
}

export default shareRecords;
