import Taro from '@tarojs/taro';
import { ShareRecord } from '@/types/share';

const STORAGE_KEY = 'share_records_store';

const defaultRecords: ShareRecord[] = [
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

function loadFromStorage(): ShareRecord[] {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (!raw) return defaultRecords;
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) return data;
    return defaultRecords;
  } catch (e) {
    console.warn('[ShareRecords] 读取本地存储失败，使用默认数据', e);
    return defaultRecords;
  }
}

function saveToStorage(records: ShareRecord[]) {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('[ShareRecords] 保存本地存储失败', e);
  }
}

let shareRecords: ShareRecord[] = loadFromStorage();

function checkAndUpdateExpiry(records: ShareRecord[]): ShareRecord[] {
  const now = new Date();
  let changed = false;
  const result = records.map(r => {
    if (r.status === 'active') {
      const exp = new Date(r.expiryDate);
      if (now > exp) {
        changed = true;
        return { ...r, status: 'expired' as const };
      }
    }
    return r;
  });
  if (changed) saveToStorage(result);
  return result;
}

export function getShareRecord(token: string): ShareRecord | undefined {
  if (!token || typeof token !== 'string') return undefined;
  const records = checkAndUpdateExpiry(shareRecords);
  shareRecords = records;
  return records.find(r => r.token === token);
}

export function createShareRecord(
  reportId: string,
  clinicName: string,
  reportTypeLabel: string,
  doctorName: string
): ShareRecord {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timePart = Date.now().toString(36).slice(-3);
  const token = `${randomPart}${timePart}`;

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

  shareRecords = [record, ...shareRecords];
  saveToStorage(shareRecords);

  console.info('[ShareRecords] 创建分享记录并持久化', { token, reportId });
  return record;
}

export function getAllShareRecords(): ShareRecord[] {
  const records = checkAndUpdateExpiry(shareRecords);
  shareRecords = records;
  return [...records];
}

export function buildShareLink(token: string): string {
  return `https://dental-report.example.com/share?token=${token}`;
}

export default shareRecords;
