<template>
  <div class="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header Row -->
    <div class="flex border-b border-gray-200 bg-gray-50">
      <div class="w-16 flex-shrink-0 border-r border-gray-200"></div> <!-- Time Gutter Header -->
      <div 
        v-for="day in weekDays" 
        :key="day.toISOString()" 
        class="flex-1 py-3 text-center border-r border-gray-200 last:border-0"
        :class="{ 'bg-spa-teal/5': isToday(day) }"
      >
        <div class="text-xs uppercase font-semibold text-gray-500">{{ formatDayName(day) }}</div>
        <div class="text-xl font-bold text-gray-800" :class="{ 'text-spa-teal': isToday(day) }">
            {{ day.getDate() }}
        </div>
      </div>
    </div>

    <!-- Scrollable Grid -->
    <div class="flex-1 overflow-y-auto relative custom-scrollbar">
       <div class="flex relative" :style="{ height: totalHeight + 'px' }">
         
         <!-- Time Gutter -->
         <div class="w-16 flex-shrink-0 border-r border-gray-200 bg-white z-10 sticky left-0">
           <div 
             v-for="hour in hours" 
             :key="hour" 
             class="absolute w-full text-center text-xs text-gray-400 -mt-2.5"
             :style="{ top: (hour - startHour) * pixelsPerHour + 'px' }"
           >
             {{ formatHour(hour) }}
           </div>
         </div>

         <!-- Day Columns -->
         <div 
            v-for="day in weekDays" 
            :key="day.toISOString()"
            class="flex-1 relative border-r border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-crosshair"
            @click="handleGridClick($event, day)"
         >
            <!-- Grid Lines -->
            <div 
                v-for="hour in hours" 
                :key="hour"
                class="absolute w-full border-b border-gray-100 pointer-events-none"
                :style="{ top: (hour - startHour) * pixelsPerHour + 'px' }"
            ></div>

            <!-- Blocks -->
            <BlockCard 
                v-for="block in getBlocksForDay(day)"
                :key="block.id"
                :block="block"
                :start-hour="startHour"
                :pixels-per-hour="pixelsPerHour"
                @click="$emit('block-click', block)"
            />
         </div>

       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleBlock } from '@/types';
import BlockCard from './BlockCard.vue';

const props = defineProps<{
  weekDays: Date[];
  blocks: ScheduleBlock[];
}>();

const emit = defineEmits<{
    (e: 'block-click', block: ScheduleBlock): void;
    (e: 'grid-click', data: { date: Date, hour: number }): void;
}>();

const startHour = 8;
const endHour = 22;
const pixelsPerHour = 60;
const totalHeight = (endHour - startHour) * pixelsPerHour;

const hours = computed(() => {
  const h = [];
  for (let i = startHour; i <= endHour; i++) {
    h.push(i);
  }
  return h;
});

function handleGridClick(event: MouseEvent, day: Date) {
    const clickY = event.offsetY; 
    const hourOffset = clickY / pixelsPerHour;
    const hour = Math.floor(startHour + hourOffset);
    
    // Clamp
    if (hour >= startHour && hour < endHour) {
        emit('grid-click', { date: day, hour });
    }
}

function isToday(date: Date) {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
}

function formatDayName(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
}

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function getBlocksForDay(date: Date) {
  return props.blocks.filter(b => {
    const blockDate = new Date(b.start);
    return blockDate.getDate() === date.getDate() && 
           blockDate.getMonth() === date.getMonth() && 
           blockDate.getFullYear() === date.getFullYear();
  });
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c0c0c0;
}
</style>
