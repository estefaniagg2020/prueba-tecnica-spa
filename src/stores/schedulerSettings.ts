import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SchedulerViewSettings } from '@/interfaces';
import { loadSchedulerSettings, saveSchedulerSettings } from '@/infrastructure/schedulerSettingsStorage';

const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 20;
const DEFAULT_PIXELS_PER_HOUR = 90;

const MIN_HOUR = 0;
const MAX_HOUR = 24;
const MIN_PIXELS = 30;
const MAX_PIXELS = 200;

function clampHour(h: number): number {
  return Math.max(MIN_HOUR, Math.min(MAX_HOUR, Math.floor(h)));
}

function clampPixels(p: number): number {
  return Math.max(MIN_PIXELS, Math.min(MAX_PIXELS, Math.floor(p)));
}

export const useSchedulerSettingsStore = defineStore('schedulerSettings', () => {
  const startHour = ref(DEFAULT_START_HOUR);
  const endHour = ref(DEFAULT_END_HOUR);
  const pixelsPerHour = ref(DEFAULT_PIXELS_PER_HOUR);

  const settings = computed<SchedulerViewSettings>(() => ({
    startHour: startHour.value,
    endHour: endHour.value,
    pixelsPerHour: pixelsPerHour.value,
  }));

  function initialize() {
    const stored = loadSchedulerSettings();
    if (stored) {
      startHour.value = clampHour(stored.startHour);
      endHour.value = clampHour(stored.endHour);
      pixelsPerHour.value = clampPixels(stored.pixelsPerHour);
      if (startHour.value >= endHour.value) {
        endHour.value = Math.min(MAX_HOUR, startHour.value + 1);
      }
    }
  }

  function updateSettings(updates: Partial<SchedulerViewSettings>) {
    if (updates.startHour !== undefined) startHour.value = clampHour(updates.startHour);
    if (updates.endHour !== undefined) endHour.value = clampHour(updates.endHour);
    if (updates.pixelsPerHour !== undefined) pixelsPerHour.value = clampPixels(updates.pixelsPerHour);
    if (startHour.value >= endHour.value) {
      endHour.value = Math.min(MAX_HOUR, startHour.value + 1);
    }
    saveSchedulerSettings(settings.value);
  }

  return {
    startHour,
    endHour,
    pixelsPerHour,
    settings,
    initialize,
    updateSettings,
  };
});
