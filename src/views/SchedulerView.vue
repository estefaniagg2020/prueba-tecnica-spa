<template>
  <div class="h-full flex flex-col md:flex-row gap-6 p-4">
    <!-- Main Left Area (Calendar) -->
    <div class="flex-1 flex flex-col h-full min-w-0 gap-4">
        
        <!-- Pending Approvals Alert (Manager Only) -->
        <div 
          v-if="authStore.currentRole === 'manager' && pendingBlocksCount > 0"
          class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between shadow-sm animate-pulse"
        >
           <div class="flex items-center gap-3">
             <span class="text-2xl">🔔</span>
             <div>
               <p class="text-sm font-bold text-yellow-800">Tienes {{ pendingBlocksCount }} cambios pendientes de aprobar</p>
               <p class="text-xs text-yellow-700">Revisa los bloques marcados con ⏳</p>
             </div>
           </div>
           <button class="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-bold rounded-lg transition-colors cursor-pointer" @click="handleReviewClick">
             Revisar
           </button>
        </div>

        <!-- Header Card -->
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

            <!-- Calendar Controls (Imported) -->
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

        <!-- content area -->
        <div class="flex-1 min-h-0 relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <WeekView 
                v-if="view === 'week'"
                :week-days="weekDays"
                :blocks="filteredBlocks"
                @block-click="handleEditBlock"
                @grid-click="handleGridClick"
            />
            <DayView 
                v-else-if="view === 'day'"
                :date="currentDate"
                :blocks="filteredBlocks"
                :therapists="filteredTherapists"
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
            
             <!-- Floating Action Button -->
            <button 
              @click="openAddModal"
              class="absolute bottom-6 right-6 w-12 h-12 bg-spa-teal text-white rounded-xl shadow-lg shadow-spa-teal/20 flex items-center justify-center text-2xl hover:scale-105 transition-transform hover:bg-[#005a5d]"
            >
              +
            </button>
        </div>
    </div>

    <!-- Right Sidebar (Team) -->
    <div class="w-full md:w-72 hidden md:flex flex-col h-full gap-4">
       <!-- Spa Selector -->
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

       <!-- Utils Card -->
       <div class="bg-gradient-to-br from-spa-primary/5 to-spa-peach/10 rounded-2xl p-4 border border-spa-peach/20">
           <h4 class="font-bold text-spa-primary text-sm mb-2">Acciones Rápidas</h4>
           <button 
               v-if="blocks.length === 0"
               @click="regenerate" 
               class="text-xs text-spa-primary hover:underline flex items-center gap-1 cursor-pointer"
           >
             ⚡ Generar datos de prueba
           </button>
           <div class="text-[10px] text-gray-400 mt-2">
             Selecciona una franja horaria en el calendario para añadir un turno rápidamente.
           </div>
       </div>
    </div>

    <!-- Mobile Drawer for Therapist List (Optional, simpler if hidden on mobile or toggleable, for now just hidden on small screens is acceptable MVP or add a toggle) -->

    <BlockEditorModal 
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
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTherapistStore } from '@/stores/therapist';
import { useScheduleStore } from '@/stores/schedule';
import { useAuthStore } from '@/stores/auth';
import { useSpaStore } from '@/stores/spa';
import { useToast } from '@/composables/useToast';
import { useCalendar } from '@/composables/useCalendar';
import { generateAllSchedules } from '@/utils/scheduleGenerator';
import TherapistRightPanel from '@/components/scheduler/TherapistRightPanel.vue';
import CalendarHeader from '@/components/scheduler/CalendarHeader.vue';
import WeekView from '@/components/scheduler/WeekView.vue';
import DayView from '@/components/scheduler/DayView.vue';
import MonthView from '@/components/scheduler/MonthView.vue';
import BlockEditorModal from '@/components/scheduler/BlockEditorModal.vue';
import type { ScheduleBlock } from '@/types';

// Stores
const therapistStore = useTherapistStore();
const scheduleStore = useScheduleStore();
const authStore = useAuthStore();
const spaStore = useSpaStore();
const { addToast } = useToast();
const { blocks } = storeToRefs(scheduleStore);

// Calendar Logic
const { currentDate, view, weekDays, next, prev, setToday } = useCalendar();

// State
const selectedTherapistId = ref<string>('');
const isModalOpen = ref(false);
const editingBlock = ref<ScheduleBlock | undefined>(undefined);
const initialBlockHour = ref<number | undefined>(undefined);
const selectedDate = ref<Date | undefined>(undefined);

// Initialization
onMounted(() => {
    therapistStore.initialize();
    scheduleStore.initialize();
    spaStore.initialize();
    
    // Auto-generate if empty
    if (scheduleStore.blocks.length === 0 && therapistStore.therapists.length > 0) {
        generateAllSchedules(therapistStore.therapists, currentDate.value);
    }
    
    updateSelectionForSpa();
});

const filteredTherapists = computed(() => {
  return therapistStore.therapists.filter(t => t.spaId === spaStore.currentSpaId || (!t.spaId && spaStore.currentSpaId === 'spa-1'));
});

// Watch current Spa to reset selection if needed
watch(() => spaStore.currentSpaId, () => {
    updateSelectionForSpa();
});

function updateSelectionForSpa() {
    const available = filteredTherapists.value;
    if (available.length > 0) {
        if (!available.find(t => t.id === selectedTherapistId.value)) {
             selectedTherapistId.value = available[0].id;
        }
    } else {
        selectedTherapistId.value = '';
    }
}

const currentTherapist = computed(() => 
    therapistStore.therapists.find(t => t.id === selectedTherapistId.value)
);

const filteredBlocks = computed(() => {
     if (view.value === 'day') {
         // Return blocks belonging to ANY therapist in the current Spa view context
         // Filter by therapist IDs present in filteredTherapists
         const therapistIds = filteredTherapists.value.map(t => t.id);
         return blocks.value.filter(b => therapistIds.includes(b.therapistId));
     }

    if (!selectedTherapistId.value) return [];
    return blocks.value.filter(b => b.therapistId === selectedTherapistId.value);
});

const pendingBlocksCount = computed(() => {
    return blocks.value.filter(b => b.status === 'pending').length;
});

function handleTherapistSelect(id: string) {
    selectedTherapistId.value = id;
}

function openAddModal() {
    editingBlock.value = undefined;
    initialBlockHour.value = undefined;
    selectedDate.value = new Date(currentDate.value); 
    isModalOpen.value = true;
}

function handleGridClick(data: { date: Date, hour: number, therapistId?: string }) {
    editingBlock.value = undefined;
    initialBlockHour.value = data.hour;
    selectedDate.value = data.date;
    
    if (data.therapistId) {
        selectedTherapistId.value = data.therapistId;
    }

    isModalOpen.value = true;
}

function handleEditBlock(block: ScheduleBlock) {
    editingBlock.value = block;
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    editingBlock.value = undefined;
}

function saveBlock(data: Partial<ScheduleBlock>) {
    if (!selectedTherapistId.value) return;

    // Detemine Status based on Role
    const newStatus = authStore.currentRole === 'manager' ? 'confirmed' : 'pending';

    if (authStore.currentRole === 'employee') {
        addToast('Cambios guardados. Esperando confirmación del manager.', 'info');
    } else {
        addToast('Cambios guardados correctamente', 'success');
    }

    if (editingBlock.value) {
        // Update
        const originalStart = new Date(editingBlock.value.start);
        const originalEnd = new Date(editingBlock.value.end); 
        
        const [startH, startM] = (data.start as string).split(':').map(Number);
        const [endH, endM] = (data.end as string).split(':').map(Number);

        originalStart.setHours(startH, startM);
        originalEnd.setHours(endH, endM);
        
        scheduleStore.updateBlock(editingBlock.value.id, {
            ...data,
            start: originalStart.toISOString(),
            end: originalEnd.toISOString(),
            status: newStatus 
        });
    } else {
        // Create
        const date = selectedDate.value ? new Date(selectedDate.value) : new Date(currentDate.value);
        
        const [startH, startM] = (data.start as string).split(':').map(Number);
        const [endH, endM] = (data.end as string).split(':').map(Number);
        
        const start = new Date(date);
        start.setHours(startH, startM);
        
        const end = new Date(date);
        end.setHours(endH, endM);

        scheduleStore.addBlock({
            therapistId: selectedTherapistId.value,
            type: data.type as any,
            title: data.title || 'Evento',
            description: data.description,
            start: start.toISOString(),
            end: end.toISOString(),
            status: newStatus
        });
    }
    closeModal();
}

function deleteBlock() {
    if (editingBlock.value) {
        scheduleStore.deleteBlock(editingBlock.value.id);
        closeModal();
    }
}

function regenerate() {
    if(confirm('¿Generar nuevos datos aleatorios? Esto borrará los cambios actuales.')) {
        // Clear all (optional, or just append)
        // scheduleStore.blocks = []; // If we wanted to clear
        generateAllSchedules(therapistStore.therapists, currentDate.value);
    }
}
function handleReviewClick() {
    addToast('Esta funcionalidad aprobaría todos los cambios (simulado)', 'success');
}
</script>
