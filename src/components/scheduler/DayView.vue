<template>
  <div class="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="flex border-b border-gray-200 bg-gray-50">
      <div class="w-16 flex-shrink-0 border-r border-gray-200 bg-white z-20"></div> <!-- Corner -->
      <!-- Therapist Columns Header -->
      <div class="flex-1 flex overflow-hidden">
        <div 
            v-for="therapist in therapists" 
            :key="therapist.id"
            class="flex-1 py-3 text-center border-r border-gray-200 last:border-0 min-w-[150px]"
            :style="{ backgroundColor: therapist.color || '#f3f4f6', color: '#1f2937' }"
        >
            <div class="font-bold truncate px-2 text-gray-800">{{ therapist.name.split(' ')[0] }}</div>
            <div class="text-[10px] opacity-70">{{ therapist.weeklyHours }}h</div>
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

         <!-- Columns Container -->
         <div class="flex-1 flex">
             <div 
                v-for="therapist in therapists" 
                :key="therapist.id"
                class="flex-1 relative border-r border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors cursor-crosshair min-w-[150px]"
                @click="handleGridClick($event, therapist.id)"
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
                    v-for="block in getBlocksForTherapist(therapist.id)"
                    :key="block.id"
                    :block="block"
                    :start-hour="startHour"
                    :pixels-per-hour="pixelsPerHour"
                    @click.stop="$emit('block-click', block)"
                />
             </div>
         </div>

       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleBlock, Therapist } from '@/types';
import BlockCard from './BlockCard.vue';

const props = defineProps<{
  date: Date;
  blocks: ScheduleBlock[];
  therapists: Therapist[];
}>();

const emit = defineEmits<{
    (e: 'block-click', block: ScheduleBlock): void;
    (e: 'grid-click', data: { date: Date, hour: number, therapistId: string }): void;
}>();

const startHour = 8;
const endHour = 22;
const pixelsPerHour = 90; 
const totalHeight = (endHour - startHour) * pixelsPerHour;

const hours = computed(() => {
  const h = [];
  for (let i = startHour; i <= endHour; i++) {
    h.push(i);
  }
  return h;
});

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function getBlocksForTherapist(therapistId: string) {
    return props.blocks.filter(b => {
        const blockDate = new Date(b.start);
        const isSameDay = blockDate.getDate() === props.date.getDate() && 
                          blockDate.getMonth() === props.date.getMonth() && 
                          blockDate.getFullYear() === props.date.getFullYear();
        return isSameDay && b.therapistId === therapistId;
    });
}

function handleGridClick(event: MouseEvent, therapistId: string) {
    const clickY = event.offsetY; 
    const hourOffset = clickY / pixelsPerHour;
    const hour = Math.floor(startHour + hourOffset);
    
    if (hour >= startHour && hour < endHour) {
        emit('grid-click', { date: props.date, hour, therapistId });
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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
