import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ScheduleBlock } from '@/types';

export const useScheduleStore = defineStore('schedule', () => {
  const blocks = ref<ScheduleBlock[]>([]);

  function initialize() {
    const stored = localStorage.getItem('spa-schedule-blocks');
    if (stored) {
      try {
        blocks.value = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing schedule blocks', e);
        blocks.value = [];
      }
    }
  }

  watch(blocks, (newVal) => {
    localStorage.setItem('spa-schedule-blocks', JSON.stringify(newVal));
  }, { deep: true });

  function addBlock(block: Omit<ScheduleBlock, 'id'>) {
    const newBlock: ScheduleBlock = {
      ...block,
      id: crypto.randomUUID(),
    };
    blocks.value.push(newBlock);
  }

  function updateBlock(id: string, updates: Partial<ScheduleBlock>) {
    const index = blocks.value.findIndex(b => b.id === id);
    if (index !== -1) {
      blocks.value[index] = { ...blocks.value[index], ...updates };
    }
  }

  function deleteBlock(id: string) {
    blocks.value = blocks.value.filter(b => b.id !== id);
  }

  function getBlocksByTherapist(therapistId: string) {
    return blocks.value.filter(b => b.therapistId === therapistId);
  }

  // Helper to check for overlaps could be added here later

  return {
    blocks,
    initialize,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlocksByTherapist
  };
});
