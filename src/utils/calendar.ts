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

export function clearCalendarEvent(reportId: string) {
  const events = getStoredEvents();
  if (events[reportId]) {
    delete events[reportId];
    saveEvents(events);
    console.info('[CalendarUtil] 清除日历事件记录', { reportId });
  }
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

  const targetDate = new Date(dateStr);
  const startTime = targetDate.getTime();
  const endTime = startTime + 30 * 60 * 1000;
  const title = reminderTitleMap[reminderType];
  const description = `${note || '口腔复诊'}。${clinicName} - ${doctorName}医生`;

  const apiAvailable =
    typeof Taro.addPhoneCalendarEvent === 'function' ||
    typeof Taro.addPhoneCalendar === 'function';

  if (!apiAvailable) {
    console.warn('[CalendarUtil] 当前环境不支持添加日历事件');
    Taro.showModal({
      title: '暂不支持日历',
      content: '当前运行环境不支持添加日历事件，请手动将就诊时间记录到日历中。',
      showCancel: false
    });
    return false;
  }

  try {
    console.info('[CalendarUtil] 添加日历事件', {
      title,
      startTime,
      endTime
    });

    let result: any = null;

    if (typeof Taro.addPhoneCalendarEvent === 'function') {
      result = await Taro.addPhoneCalendarEvent({
        title,
        description,
        startTime: String(startTime),
        endTime: String(endTime),
        alarmOffset: '0,-60',
        allDay: false
      });
    } else if (typeof Taro.addPhoneCalendar === 'function') {
      result = await Taro.addPhoneCalendar({
        title,
        description,
        startTime: String(startTime),
        endTime: String(endTime),
        alarmOffset: '0,-60',
        allDay: false
      });
    }

    const hasValidResult = result && (result.eventId || result._success === true || result.errMsg === 'ok');

    if (!hasValidResult) {
      console.warn('[CalendarUtil] 日历接口返回异常', result);
      Taro.showModal({
        title: '添加失败',
        content: '未能成功添加到日历，请检查日历权限设置，或手动添加就诊提醒。',
        showCancel: false
      });
      return false;
    }

    const eventId =
      result.eventId ||
      result.eventID ||
      `local_${reportId}_${Date.now()}`;

    const events = getStoredEvents();
    events[reportId] = {
      reportId,
      reminderType,
      eventId,
      addedAt: new Date().toISOString()
    };
    saveEvents(events);

    console.info('[CalendarUtil] 成功添加日历事件', { reportId, eventId });
    Taro.showToast({ title: '已添加到日历', icon: 'success' });
    return true;
  } catch (err: any) {
    console.error('[CalendarUtil] 添加日历失败', err);

    const errMsg = err?.errMsg || err?.message || '';

    if (errMsg.includes('auth') || errMsg.includes('deny') || errMsg.includes('权限')) {
      Taro.showModal({
        title: '需要日历权限',
        content: '请在系统设置中授予日历访问权限，以便添加就诊提醒。',
        showCancel: false
      });
    } else {
      Taro.showModal({
        title: '添加日历失败',
        content: '未能成功添加到日历，请稍后重试，或手动记录就诊时间。',
        showCancel: false
      });
    }

    return false;
  }
}
