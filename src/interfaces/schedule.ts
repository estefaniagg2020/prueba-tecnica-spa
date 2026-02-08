export type ScheduleBlockType = 'work' | 'vacation' | 'training' | 'admin' | 'other';

export interface ScheduleBlock {
  id: string;
  therapistId: string;
  start: string;
  end: string;
  type: ScheduleBlockType;
  title: string;
  description?: string;
  status?: 'confirmed' | 'pending';
}

export interface ViewOption {
  value: 'day' | 'week' | 'month';
  label: string;
}

export interface SchedulerViewSettings {
  startHour: number;
  endHour: number;
  pixelsPerHour: number;
}
