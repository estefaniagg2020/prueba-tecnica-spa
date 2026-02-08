<template>
  <div class="h-full flex flex-col md:flex-row gap-6 p-4">

    <div class="flex-1 flex flex-col h-full min-w-0 gap-4">
        
        <div 
          v-if="authStore.currentRole === ROLE_MANAGER && pendingBlocksCount > 0"
          class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between shadow-sm animate-pulse"
        >
            <div class="flex items-center gap-3">
             <span class="text-2xl">🔔</span>
             <div>
               <p class="text-sm font-bold text-yellow-800">{{ SCHEDULER_CONSTANTS.PENDING_CHANGES_MSG(pendingBlocksCount) }}</p>
               <p class="text-xs text-yellow-700">{{ SCHEDULER_CONSTANTS.REVIEW_HINT }}</p>
             </div>
           </div>
           <button class="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-bold rounded-lg transition-colors cursor-pointer" @click="handleReviewClick">
             {{ SCHEDULER_CONSTANTS.REVISE_BUTTON }}
           </button>
        </div>


        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 class="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                <span class="text-xl md:text-2xl">🗓️</span> 
                {{ currentTherapist ? `Agenda de ${currentTherapist.name}` : 'Mi Horario' }}
              </h2>
              <p class="text-gray-400 text-[10px] md:text-xs mt-0.5 pl-1">
                 {{ currentDate.getFullYear() }}
              </p>
            </div>

             <CalendarHeader 
                :current-date="currentDate"
                :current-view="view"
                @prev="prev"
                @next="next"
                @today="setToday"
                @changeView="view = $event"
                class="!p-0 !bg-transparent !border-0 !shadow-none w-full md:w-auto overflow-x-auto"
             />
        </div>


        <div class="flex-1 min-h-0 relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <WeekView 
                v-if="view === 'week'"
                :week-days="weekDays"
                :blocks="filteredBlocks"
                v-bind="gridSettings"
                @block-click="handleEditBlock"
                @grid-click="handleGridClick"
            />
            <DayView 
                v-else-if="view === 'day'"
                :date="currentDate"
                :blocks="filteredBlocks"
                :therapists="filteredTherapists"
                v-bind="gridSettings"
                @block-click="handleEditBlock"
                @grid-click="handleGridClick"
            />
            <MonthView
                v-else-if="view === 'month'"
                :current-date="currentDate"
                :blocks="filteredBlocks"
                @block-click="handleEditBlock"
                @grid-click="handleGridClick"
            />
            

            <button 
              @click="openAddModal"
              class="absolute bottom-6 right-6 w-12 h-12 bg-spa-teal text-white rounded-xl shadow-lg shadow-spa-teal/20 flex items-center justify-center text-2xl hover:scale-105 transition-transform hover:bg-[#005a5d]"
            >
              +
            </button>
        </div>
    </div>

    <div class="w-full md:w-72 hidden md:flex flex-col h-full gap-4">
       <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Vista del horario</label>
          <div class="space-y-3">
            <div>
              <label class="text-[10px] text-gray-500 block mb-0.5">Hora inicio</label>
              <input
                type="number"
                min="0"
                max="24"
                :value="schedulerSettings.startHour"
                @input="updateStartHour($event)"
                class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spa-teal/20"
              />
            </div>
            <div>
              <label class="text-[10px] text-gray-500 block mb-0.5">Hora fin</label>
              <input
                type="number"
                min="0"
                max="24"
                :value="schedulerSettings.endHour"
                @input="updateEndHour($event)"
                class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spa-teal/20"
              />
            </div>
            <div>
              <label class="text-[10px] text-gray-500 block mb-0.5">Altura por hora (px)</label>
              <input
                type="number"
                min="30"
                max="200"
                :value="schedulerSettings.pixelsPerHour"
                @input="updatePixelsPerHour($event)"
                class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spa-teal/20"
              />
            </div>
          </div>
       </div>

       <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Spa / Centro</label>
          <select 
            v-model="spaStore.currentSpaId" 
            class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-spa-teal/20"
          >
            <option v-for="spa in spaStore.spas" :key="spa.id" :value="spa.id">
               {{ spa.name }}
            </option>
          </select>
       </div>

       <TherapistRightPanel 
          :therapists="filteredTherapists" 
          :selected-id="selectedTherapistId" 
          @select="handleTherapistSelect"
       />


       <div class="bg-gradient-to-br from-spa-primary/5 to-spa-peach/10 rounded-2xl p-4 border border-spa-peach/20">
           <h4 class="font-bold text-spa-primary text-sm mb-2">{{ SCHEDULER_CONSTANTS.QUICK_ACTIONS_TITLE }}</h4>
           <button 
               v-if="blocks.length === 0"
               @click="regenerate" 
               class="text-xs text-spa-primary hover:underline flex items-center gap-1 cursor-pointer"
           >
             {{ SCHEDULER_CONSTANTS.GENERATE_TEST_DATA }}
           </button>
           <div class="text-[10px] text-gray-400 mt-2">
             {{ SCHEDULER_CONSTANTS.QUICK_ADD_HINT }}
           </div>
       </div>
    </div>



    <BlockEditorModal 
        :key="modalOpenKey"
        :is-open="isModalOpen"
        :edit-block="editingBlock"
        :initial-date="selectedDate"
        :initial-hour="initialBlockHour"
        @close="closeModal"
        @save="saveBlock"
        @delete="deleteBlock"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTherapistStore } from '@/stores/therapist';
import { useScheduleStore } from '@/stores/schedule';
import { useAuthStore } from '@/stores/auth';
import { useSpaStore } from '@/stores/spa';
import { useSchedulerSettingsStore } from '@/stores/schedulerSettings';
import { useToast } from '@/composables/useToast';
import { useCalendar } from '@/composables/useCalendar';
import { useScheduleActions } from '@/composables/useScheduleActions';
import { SCHEDULER_CONSTANTS } from '@/data/constants';
import { AUTH_CONFIG } from '@/data/authConfig';
import { generateAllSchedules } from '@/utils/scheduleGenerator';
import TherapistRightPanel from '@/components/scheduler/TherapistRightPanel.vue';
import CalendarHeader from '@/components/scheduler/CalendarHeader.vue';
import WeekView from '@/components/scheduler/WeekView.vue';
import DayView from '@/components/scheduler/DayView.vue';
import MonthView from '@/components/scheduler/MonthView.vue';
import BlockEditorModal from '@/components/scheduler/BlockEditorModal.vue';
import type { ScheduleBlock } from '@/types';

const therapistStore = useTherapistStore();
const scheduleStore = useScheduleStore();
const authStore = useAuthStore();
const spaStore = useSpaStore();
const schedulerSettingsStore = useSchedulerSettingsStore();
const schedulerSettings = storeToRefs(schedulerSettingsStore);
const ROLE_MANAGER = AUTH_CONFIG.ROLE_MANAGER;
const { addToast } = useToast();
const { blocks } = storeToRefs(scheduleStore);
const { saveBlock: saveScheduleBlock } = useScheduleActions();


const { currentDate, view, weekDays, next, prev, setToday } = useCalendar();


const userSelectedTherapistId = ref<string>('');
const isModalOpen = ref(false);
const modalOpenKey = ref(0);
const editingBlock = ref<ScheduleBlock | undefined>(undefined);
const initialBlockHour = ref<number | undefined>(undefined);
const selectedDate = ref<Date | undefined>(undefined);

onMounted(() => {
    therapistStore.initialize();
    scheduleStore.initialize();
    spaStore.initialize();
    schedulerSettingsStore.initialize();

    if (scheduleStore.blocks.length === 0 && therapistStore.therapists.length > 0) {
        generateAllSchedules(therapistStore.therapists, currentDate.value);
    }
});

const updateStartHour = (event: Event) => {
  const n = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(n)) schedulerSettingsStore.updateSettings({ startHour: n });
};

const updateEndHour = (event: Event) => {
  const n = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(n)) schedulerSettingsStore.updateSettings({ endHour: n });
};

const updatePixelsPerHour = (event: Event) => {
  const n = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(n)) schedulerSettingsStore.updateSettings({ pixelsPerHour: n });
};

const gridSettings = computed(() => ({
  startHour: schedulerSettings.startHour.value,
  endHour: schedulerSettings.endHour.value,
  pixelsPerHour: schedulerSettings.pixelsPerHour.value,
}));

const filteredTherapists = computed(() => {
  return therapistStore.therapists.filter(therapist => therapist.spaId === spaStore.currentSpaId || (!therapist.spaId && spaStore.currentSpaId === 'spa-1'));
});

const selectedTherapistId = computed({
  get() {
    const id = userSelectedTherapistId.value;
    const available = filteredTherapists.value;
    return available.some(t => t.id === id) ? id : (available[0]?.id ?? '');
  },
  set(id: string) {
    userSelectedTherapistId.value = id;
  }
});

const currentTherapist = computed(() => 
    therapistStore.therapists.find(therapist => therapist.id === selectedTherapistId.value)
);

const filteredBlocks = computed(() => {
     if (view.value === 'day') {
         const therapistIds = filteredTherapists.value.map(therapist => therapist.id);
         return blocks.value.filter(block => therapistIds.includes(block.therapistId));
     }

    if (!selectedTherapistId.value) return [];
    return blocks.value.filter(block => block.therapistId === selectedTherapistId.value);
});

const pendingBlocksCount = computed(() => {
    return blocks.value.filter(block => block.status === 'pending').length;
});

const handleTherapistSelect = (id: string) => {
    selectedTherapistId.value = id;
};

const openAddModal = () => {
    editingBlock.value = undefined;
    initialBlockHour.value = undefined;
    selectedDate.value = new Date(currentDate.value);
    modalOpenKey.value += 1;
    isModalOpen.value = true;
};

const handleGridClick = (data: { date: Date, hour: number, therapistId?: string }) => {
    editingBlock.value = undefined;
    initialBlockHour.value = data.hour;
    selectedDate.value = data.date;

    if (data.therapistId) {
        selectedTherapistId.value = data.therapistId;
    }

    modalOpenKey.value += 1;
    isModalOpen.value = true;
};

const handleEditBlock = (block: ScheduleBlock) => {
    editingBlock.value = block;
    modalOpenKey.value += 1;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    editingBlock.value = undefined;
};

const saveBlock = (data: Partial<ScheduleBlock>) => {
    saveScheduleBlock({
        data,
        therapistId: selectedTherapistId.value,
        currentDate: currentDate.value,
        selectedDate: selectedDate.value,
        editingBlock: editingBlock.value,
        onSuccess: closeModal
    });
};

const deleteBlock = () => {
    if (editingBlock.value) {
        scheduleStore.deleteBlock(editingBlock.value.id);
        closeModal();
    }
};

const regenerate = () => {
    if(confirm(SCHEDULER_CONSTANTS.REGENERATE_CONFIRM)) {
        generateAllSchedules(therapistStore.therapists, currentDate.value);
    }
};
const handleReviewClick = () => {
    addToast(SCHEDULER_CONSTANTS.APPROVE_SIMULATION_MSG, 'success');
};
</script>
