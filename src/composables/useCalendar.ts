import { ref, computed } from 'vue';

type ViewType = 'day' | 'week' | 'month';

export function useCalendar() {
  const currentDate = ref(new Date());
  const view = ref<ViewType>('week');

  // Helper: Clone date to avoid mutation
  const cloneDate = (date: Date) => new Date(date.getTime());

  const startOfWeek = computed(() => {
    const d = cloneDate(currentDate.value);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const weekDays = computed(() => {
    const start = startOfWeek.value;
    return Array.from({ length: 7 }, (_, i) => {
      const d = cloneDate(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  });

  const monthDays = computed(() => {
    const d = cloneDate(currentDate.value);
    d.setDate(1); // Start of month
    const days = [];
    // Get previous month days to fill grid if needed (simple version: just current month for now, or full grid)
    // Let's do a simple full month 
    const month = d.getMonth();
    while (d.getMonth() === month) {
        days.push(cloneDate(d));
        d.setDate(d.getDate() + 1);
    }
    return days;
  });

  function next() {
    const d = cloneDate(currentDate.value);
    if (view.value === 'day') d.setDate(d.getDate() + 1);
    else if (view.value === 'week') d.setDate(d.getDate() + 7);
    else if (view.value === 'month') d.setMonth(d.getMonth() + 1);
    currentDate.value = d;
  }

  function prev() {
    const d = cloneDate(currentDate.value);
    if (view.value === 'day') d.setDate(d.getDate() - 1);
    else if (view.value === 'week') d.setDate(d.getDate() - 7);
    else if (view.value === 'month') d.setMonth(d.getMonth() - 1);
    currentDate.value = d;
  }

  function setToday() {
    currentDate.value = new Date();
  }

  function formatDate(date: Date, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  return {
    currentDate,
    view,
    startOfWeek,
    weekDays,
    monthDays,
    next,
    prev,
    setToday,
    formatDate
  };
}
