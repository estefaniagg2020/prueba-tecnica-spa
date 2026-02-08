import { computed, type MaybeRefOrGetter, toValue, type ComputedRef } from 'vue';
import { formatHour } from './useScheduleDates';

export const useScheduleGrid = (
  startHour: MaybeRefOrGetter<number>,
  endHour: MaybeRefOrGetter<number>,
  pixelsPerHour: MaybeRefOrGetter<number>
): {
  hours: ComputedRef<number[]>;
  totalHeight: ComputedRef<number>;
  formatHour: (hour: number) => string;
  getHourFromClick: (event: MouseEvent, topOffsetPx?: number) => number | null;
} => {
  const hours = computed(() => {
    const start = toValue(startHour);
    const end = toValue(endHour);
    const hourNumbers: number[] = [];
    for (let hour = start; hour <= end; hour++) {
      hourNumbers.push(hour);
    }
    return hourNumbers;
  });

  const totalHeight = computed(() => {
    const start = toValue(startHour);
    const end = toValue(endHour);
    const pixels = toValue(pixelsPerHour);
    return (end - start) * pixels;
  });

  const getHourFromClick = (event: MouseEvent, topOffsetPx = 0): number | null => {
    const start = toValue(startHour);
    const end = toValue(endHour);
    const pixels = toValue(pixelsPerHour);
    const clickY = event.offsetY - topOffsetPx;
    const hourOffset = clickY / pixels;
    const hour = Math.floor(start + hourOffset);
    if (hour >= start && hour < end) return hour;
    return null;
  };

  return {
    hours,
    totalHeight,
    formatHour,
    getHourFromClick,
  };
};
