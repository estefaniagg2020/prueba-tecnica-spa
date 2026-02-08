import type { SchedulerViewSettings } from '@/interfaces';

const KEY = 'spa-scheduler-view-settings';

export function loadSchedulerSettings(): SchedulerViewSettings | null {
  const raw = localStorage.getItem(KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'startHour' in parsed &&
      'endHour' in parsed &&
      'pixelsPerHour' in parsed &&
      typeof (parsed as SchedulerViewSettings).startHour === 'number' &&
      typeof (parsed as SchedulerViewSettings).endHour === 'number' &&
      typeof (parsed as SchedulerViewSettings).pixelsPerHour === 'number'
    ) {
      return parsed as SchedulerViewSettings;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveSchedulerSettings(settings: SchedulerViewSettings): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
