export const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

export const formatHour = (hour: number): string =>
  `${hour.toString().padStart(2, '0')}:00`;

export const formatDayName = (date: Date): string =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);

export const formatTime = (dateStr: string): string =>
  new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));

export const isToday = (date: Date): boolean => isSameDay(date, new Date());

export const useScheduleDates = () => ({
  isSameDay,
  isToday,
  formatHour,
  formatDayName,
  formatTime,
});
