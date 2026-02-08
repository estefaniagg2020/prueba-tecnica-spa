import type { ScheduleBlockType } from '@/types';
import { getBlockTypeCardStyle } from '@/data/scheduleBlockTypes';

export const getBlockTypeCardStyles = (type: ScheduleBlockType) =>
  getBlockTypeCardStyle(type);
