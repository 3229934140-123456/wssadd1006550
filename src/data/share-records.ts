import Taro from '@tarojs/taro';
import { ShareRecord } from '@/types/share';

const STORAGE_KEY = 'share_records_store_v2';

function encodeTokenPayload(reportId: string, createdAt: number): string {
  const raw = `${reportId}|${createdAt}`;
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    result += (code + 31).toString(36);
    if (i < raw.length - 1) result += '-';
  }
  return result;
}

function decodeTokenPayload(token: string): { reportId?: string; createdAt?: number } {
  try {
    const segments = token.split('.');
    if (segments.length < 2) return {};
    const payload = segments[0];
    const parts = payload.split('-');
    const chars: string[] = [];
    for (const p of parts) {
      const n = parseInt(p, 36) - 31;
      if (isNaN(n) || n < 0) return {};
      chars.push(String.fromCharCode(n));
    }
    const decoded = chars.join('');
    const [reportId, timeStr] = decoded.split('|');
    const createdAt = parseInt(timeStr, 10);
    if (!reportId || !createdAt || isNaN(createdAt)) return {};
    return { reportId, createdAt };
  } catch (e) {
    console.warn('[ShareRecords] token 解码失败', token, e);
    return {};
  }
}

const metaMap: Record<string, { clinicName: string; reportTypeLabel: string; doctorName: string }> = {
  RPT001: { clinicName: '康美口腔门诊部', reportTypeLabel: '全景片', doctorName: '李明华' },
  RPT002: { clinicName: '康美口腔门诊部', reportTypeLabel: '根尖片', doctorName: '李明华' },
  RPT003: { clinicName: '康美口腔门诊部', reportTypeLabel: 'CBCT', doctorName: '陈建国' },
  RPT004: { clinicName: '康美口腔门诊部', reportTypeLabel: '全景片', doctorName: '王秀英' },
  RPT005: { clinicName: '康美口腔门诊部', reportTypeLabel: 'CBCT', doctorName: '王秀英' },
  RPT006: { clinicName: '康美口腔门诊部', reportTypeLabel: '根尖片', doctorName: '陈建国' },
  RPT007: { clinicName: '康美口腔门诊部', reportTypeLabel: '全景片', doctorName: '李明华' },
  RPT008: { clinicName: '康美口腔门诊部', reportTypeLabel: 'CBCT', doctorName: '陈建国' },
  RPT009: { clinicName: '康美口腔门诊部', reportTypeLabel: '根尖片', doctorName: '王秀英' },
  RPT010: { clinicName: '康美口腔门诊部', reportTypeLabel: '全景片', doctorName: '李明华' }
};

const defaultMeta = { clinicName: '康美口腔门诊部', reportTypeLabel: '口腔检查', doctorName: '主治医师' };

function getReportMeta(reportId: string) {
  return metaMap[reportId] || defaultMeta;
}

const defaultRecords: ShareRecord[] = [
  {
    token: 'abcd-1234.abc12345',
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
    token: 'wxyz-6789.def67890',
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
    token: 'valid-test-01.abc123',
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
    if (!raw) {
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(defaultRecords));
      return [...defaultRecords];
    }
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) return data;
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(defaultRecords));
    return [...defaultRecords];
  } catch (e) {
    console.warn('[ShareRecords] 读取本地存储失败，使用默认数据', e);
    return [...defaultRecords];
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

  let found = records.find(r => r.token === token);

  if (!found) {
    const { reportId, createdAt } = decodeTokenPayload(token);
    if (reportId && createdAt) {
      const createdDate = new Date(createdAt);
      const expiry = new Date(createdDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const meta = getReportMeta(reportId);
      const restored: ShareRecord = {
        token,
        reportId,
        clinicName: meta.clinicName,
        reportTypeLabel: meta.reportTypeLabel,
        doctorName: meta.doctorName,
        createdAt: createdDate.toISOString(),
        expiryDate: expiry.toISOString(),
        createdBy: '张小明',
        status: now > expiry ? 'expired' : 'active'
      };
      shareRecords = [restored, ...records];
      saveToStorage(shareRecords);
      console.info('[ShareRecords] 从 token 还原分享记录', { token, reportId });
      return restored;
    }
    return undefined;
  }

  return found;
}

export function createShareRecord(
  reportId: string,
  clinicName: string,
  reportTypeLabel: string,
  doctorName: string
): ShareRecord {
  const now = new Date();
  const nowTs = now.getTime();
  const expiry = new Date(nowTs + 3 * 24 * 60 * 60 * 1000);

  const payload = encodeTokenPayload(reportId, nowTs);
  const randomPart = Math.random().toString(36).substring(2, 8);
  const token = `${payload}.${randomPart}`;

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

export function revokeShareRecord(token: string): boolean {
  if (!token) return false;
  const records = checkAndUpdateExpiry(shareRecords);
  const idx = records.findIndex(r => r.token === token);
  if (idx === -1) return false;
  if (records[idx].status !== 'active') return false;

  const updated = [...records];
  updated[idx] = {
    ...updated[idx],
    status: 'revoked',
    revokedAt: new Date().toISOString()
  };
  shareRecords = updated;
  saveToStorage(updated);
  console.info('[ShareRecords] 撤销分享链接', { token });
  return true;
}

export function regenerateShareRecord(oldToken: string): ShareRecord | undefined {
  const old = getShareRecord(oldToken);
  if (!old) return undefined;
  return createShareRecord(
    old.reportId,
    old.clinicName,
    old.reportTypeLabel,
    old.doctorName
  );
}

export function markShareAsRead(token: string, readerName: string = '家属'): boolean {
  if (!token) return false;
  const records = checkAndUpdateExpiry(shareRecords);
  const idx = records.findIndex(r => r.token === token);
  if (idx === -1) return false;

  if (!records[idx].readAt) {
    const updated = [...records];
    updated[idx] = {
      ...updated[idx],
      readAt: new Date().toISOString(),
      readBy: readerName
    };
    shareRecords = updated;
    saveToStorage(updated);
    console.info('[ShareRecords] 标记为已读', { token, readerName });
  }
  return true;
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
