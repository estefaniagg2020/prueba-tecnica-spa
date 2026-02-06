<template>
  <div 
    class="absolute inset-x-1 rounded-md px-2 py-1 text-xs font-medium border-l-4 overflow-hidden cursor-pointer transition-all hover:brightness-95 hover:z-10 shadow-sm"
    :class="[
      colorClass.bg, 
      colorClass.border, 
      colorClass.text, 
      isSmall ? 'flex items-center justify-center p-0' : '',
      block.status === 'pending' ? 'opacity-70 border-dashed !border-l-4 ring-2 ring-gray-300 ring-offset-1' : ''
    ]"
    :style="cardStyle"
    @click.stop="$emit('click')"
  >
    <div v-if="!isSmall" class="flex flex-col h-full">
      <div class="flex items-center justify-between w-full">
         <span class="font-bold truncate">{{ block.title }}</span>
         <span v-if="block.status === 'pending'" class="text-[10px] bg-white/50 px-1 rounded" title="Pendiente de confirmación">⏳</span>
         <span v-else class="opacity-70 text-[10px]">{{ formatTime(block.start) }}</span>
      </div>
      
      <div class="truncate text-[10px] opacity-90 mt-0.5" v-if="block.description">
        {{ block.description }}
      </div>
    </div>
    
    <span v-else class="truncate text-[10px]">
        {{ block.title }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleBlock } from '@/types';

const props = defineProps<{
  block: ScheduleBlock;
  startHour: number; // e.g., 8
  pixelsPerHour: number; // e.g., 60
}>();

defineEmits(['click']);

const colorClass = computed(() => {
  switch (props.block.type) {
    case 'work': return { bg: 'bg-spa-teal/10', border: 'border-spa-teal', text: 'text-spa-teal' };
    case 'vacation': return { bg: 'bg-spa-primary/10', border: 'border-spa-primary', text: 'text-spa-primary' };
    case 'training': return { bg: 'bg-spa-olive/10', border: 'border-spa-olive', text: 'text-spa-olive' };
    case 'admin': return { bg: 'bg-spa-peach/20', border: 'border-spa-peach', text: 'text-gray-700' };
    default: return { bg: 'bg-gray-100', border: 'border-gray-500', text: 'text-gray-700' };
  }
});

function getMinutesFromMidnight(dateStr: string) {
  const d = new Date(dateStr);
  return d.getHours() * 60 + d.getMinutes();
}

const top = computed(() => {
  const startMinutes = getMinutesFromMidnight(props.block.start);
  const offsetMinutes = startMinutes - (props.startHour * 60);
  return (offsetMinutes / 60) * props.pixelsPerHour;
});

const height = computed(() => {
  const startMinutes = getMinutesFromMidnight(props.block.start);
  const endMinutes = getMinutesFromMidnight(props.block.end);
  const duration = endMinutes - startMinutes;
  return (duration / 60) * props.pixelsPerHour;
});

const cardStyle = computed(() => ({
    top: `${top.value}px`,
    height: `${height.value}px`,
}));

const isSmall = computed(() => height.value < 40);

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}
</script>
