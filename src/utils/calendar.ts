import Taro from '@tarojs/taro';
import { ReminderType } from '@/types/report';

const STORAGE_KEY = 'calendar_events_set';

interface CalendarEventMeta {
  reportId: string;
  reminderType: ReminderType;
  eventId: string;
  addedAt: string;
}

const reminderTitleMap: Record<ReminderType, string> = {
  one_week: '口腔复诊提醒',
  three_months: '口腔复查提醒',
  pre_implant: '种植术前沟通'
};

function getStoredEvents(): Record<string, CalendarEventMeta> {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('[CalendarUtil] 读取本地存储失败', e);
    return {};
  }
}

function saveEvents(events: Record<string, CalendarEventMeta>) {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('[CalendarUtil] 保存本地存储失败', e);
  }
}

export function isCalendarEventAdded(reportId: string): boolean {
  const events = getStoredEvents();
  return !!events[reportId];
}

export function markCalendarAdded(
  reportId: string,
  reminderType: ReminderType,
  eventId: string
) {
  const events = getStoredEvents();
  events[reportId] = {
    reportId,
    reminderType,
    eventId,
    addedAt: new Date().toISOString()
  };
  saveEvents(events);
  console.info('[CalendarUtil] 标记已添加到日历', { reportId, eventId });
}

export async function addToCalendar(
  reportId: string,
  reminderType: ReminderType,
  dateStr: string,
  note: string,
  clinicName: string,
  doctorName: string
): Promise<boolean> {
  if (isCalendarEventAdded(reportId)) {
    Taro.showToast({ title: '已添加到日历', icon: 'success' });
    return true;
  }

  try {
    const targetDate = new Date(dateStr);
    const startTime = targetDate.getTime();
    const endTime = startTime + 30 * 60 * 1000;
    const title = reminderTitleMap[reminderType];
    const description = `${note || '口腔复诊'}。${clinicName} - ${doctorName}医生`;

    const systemInfo = Taro.getSystemInfoSync();
    console.info('[CalendarUtil] 添加日历事件', {
      title,
      startTime,
      endTime,
      platform: systemInfo.platform
    });

    let result: any = null;

    if (Taro.addPhoneCalendarEvent) {
      result = await Taro.addPhoneCalendarEvent({
        title,
        description,
        startTime: String(startTime),
        endTime: String(endTime),
        alarmOffset: '0,-60',
        allDay: false
      });
    } else if (Taro.addPhoneCalendar) {
      result = await Taro.addPhoneCalendar({
        title,
        description,
        startTime: String(startTime),
        endTime: String(endTime),
        alarmOffset: '0,-60',
        allDay: false
      });
    }

    if (result && result.eventId) {
      markCalendarAdded(reportId, reminderType, result.eventId);
    } else {
      markCalendarAdded(reportId, reminderType, Date.now().toString());
    }

    Taro.showToast({ title: '已添加到日历', icon: 'success' });
    return true;
  } catch (err: any) {
    console.error('[CalendarUtil] 添加日历失败', err);
    if (err && (err.errMsg || err.message)) {
      Taro.showModal({
        title: '添加日历失败',
        content: '请检查日历权限，或手动将就诊时间添加到日历中。',
        showCancel: false
      });
    }
    return false;
  }
}
