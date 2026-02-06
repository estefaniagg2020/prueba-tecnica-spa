<template>
  <div class="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header Row (Days of Week) -->
    <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
      <div 
        v-for="dayName in dayNames" 
        :key="dayName" 
        class="py-2 text-center text-xs uppercase font-semibold text-gray-500"
      >
        {{ dayName }}
      </div>
    </div>

    <!-- Grid -->
    <div class="flex-1 grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
      <div 
        v-for="day in days" 
        :key="day.date.toISOString()"
        class="bg-white p-2 min-h-[100px] flex flex-col relative cursor-pointer hover:bg-gray-50 transition-colors"
        :class="{ 'bg-gray-50 text-gray-400': !day.isCurrentMonth, 'bg-spa-teal/5': day.isToday }"
        @click="handleDayClick(day.date)"
      >
        <div class="text-right text-sm font-medium mb-1" :class="day.isToday ? 'text-spa-teal font-bold' : 'text-gray-700'">
             {{ day.date.getDate() }}
        </div>

        <div class="flex-1 flex flex-col gap-1 overflow-hidden">
             <div 
                v-for="block in day.blocks.slice(0, 3)" 
                :key="block.id"
                class="px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer hover:opacity-80 transition-opacity"
                :class="getTypeClass(block.type)"
                @click.stop="$emit('block-click', block)"
            >
                {{ formatTime(block.start) }} {{ block.title }}
             </div>
             <div v-if="day.blocks.length > 3" class="text-[10px] text-gray-500 pl-1">
                 + {{ day.blocks.length - 3 }} más
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleBlock, ScheduleBlockType } from '@/types';

const props = defineProps<{
  currentDate: Date; // The month to display
  blocks: ScheduleBlock[];
}>();

const emit = defineEmits<{
    (e: 'block-click', block: ScheduleBlock): void;
    (e: 'grid-click', data: { date: Date, hour: number }): void;
}>();

const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const days = computed(() => {
    // Generate grid from start of first week to end of last week
    const year = props.currentDate.getFullYear();
    const month = props.currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);

    // Start date (Monday of the first week)
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay(); // 0 is Sunday
    const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Normalize to Mon=0
    startDate.setDate(startDate.getDate() - diff);

    const result = [];
    const current = new Date(startDate);
    
    // 6 weeks * 7 days = 42 cells to ensure full coverage (sometimes 5 rows enough, but 6 covers all)
    // Or just loop until we pass the end date
    
    for (let i = 0; i < 42; i++) {
        const d = new Date(current);
        const isCurrentMonth = d.getMonth() === month;
        const isToday = isSameDay(d, new Date());
        
        const dayBlocks = props.blocks.filter(b => isSameDay(new Date(b.start), d))
                                      .sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        result.push({
            date: d,
            isCurrentMonth,
            isToday,
            blocks: dayBlocks
        });
        current.setDate(current.getDate() + 1);
    }
    return result;
});

function isSameDay(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
}

function getTypeClass(type: ScheduleBlockType) {
    switch (type) {
        case 'work': return 'bg-[#017074] text-white';
        case 'vacation': return 'bg-[#db7f50] text-white';
        case 'training': return 'bg-[#7f8563] text-white';
        case 'admin': return 'bg-[#f6c8ae] text-[#8c5e3c]';
        default: return 'bg-gray-400 text-white';
    }
}

function formatTime(dateStr: string) {
    return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
}

function handleDayClick(date: Date) {
    // Defaulting to 9am for quick add on month view click
    emit('grid-click', { date: date, hour: 9 });
}
</script>
