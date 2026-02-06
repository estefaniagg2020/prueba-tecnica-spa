<template>
  <Modal :is-open="isOpen" @close="$emit('close')">
    <template #title>
      {{ isEditing ? 'Editar Bloque' : 'Nuevo Bloque' }}
    </template>

    <form @submit.prevent="save" class="space-y-4">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">Título</label>
        <input 
          v-model="form.title" 
          type="text" 
          placeholder="ej. Turno Mañana" 
          required 
          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50 transition-all font-medium"
        >
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">Tipo de Actividad</label>
        <div class="grid grid-cols-2 gap-2">
          <button 
            type="button"
            v-for="type in types" 
            :key="type.value"
            @click="form.type = type.value"
            class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all flex items-center justify-center gap-2"
            :class="form.type === type.value ? type.activeClass : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'"
          >
             <span>{{ type.icon }}</span> {{ type.label }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
           <label class="block text-sm font-bold text-gray-700 mb-1">Inicio</label>
           <input 
             v-model="form.startTime" 
             type="time" 
             required
             class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50"
           >
        </div>
        <div>
           <label class="block text-sm font-bold text-gray-700 mb-1">Fin</label>
           <input 
             v-model="form.endTime" 
             type="time" 
             required
             class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50"
           >
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">Notas (Opcional)</label>
        <textarea 
          v-model="form.description" 
          rows="2" 
          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50"
        ></textarea>
      </div>
      
      <div v-if="error" class="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
          {{ error }}
      </div>

      <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <button 
           v-if="isEditing" 
           type="button" 
           @click="$emit('delete')"
           class="mr-auto text-red-400 hover:text-red-600 font-medium text-sm px-2"
        >
            Eliminar
        </button>
        <BaseButton variant="ghost" type="button" @click="$emit('close')">Cancelar</BaseButton>
        <BaseButton type="submit">{{ isEditing ? 'Guardar' : 'Añadir' }}</BaseButton>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import Modal from '../common/Modal.vue';
import BaseButton from '../common/BaseButton.vue';
import type { ScheduleBlock, ScheduleBlockType } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  editBlock?: ScheduleBlock;
  initialDate?: Date;
  initialHour?: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: Partial<ScheduleBlock>): void;
  (e: 'delete'): void;
}>();

const form = reactive({
  title: '',
  type: 'work' as ScheduleBlockType,
  startTime: '09:00',
  endTime: '13:00',
  description: ''
});

const error = ref('');

const isEditing = computed(() => !!props.editBlock);

const types: { value: ScheduleBlockType, label: string, icon: string, activeClass: string }[] = [
  { value: 'work', label: 'Trabajo', icon: '💼', activeClass: 'border-[#017074] bg-[#017074]/10 text-[#017074]' },
  { value: 'vacation', label: 'Vacaciones', icon: '🏖️', activeClass: 'border-[#db7f50] bg-[#db7f50]/10 text-[#db7f50]' },
  { value: 'training', label: 'Formación', icon: '📚', activeClass: 'border-[#7f8563] bg-[#7f8563]/10 text-[#7f8563]' },
  { value: 'admin', label: 'Admin', icon: '⚙️', activeClass: 'border-[#f6c8ae] bg-[#f6c8ae]/20 text-[#db7f50]' },
];

watch(() => props.isOpen, (open) => {
  if (open) {
    error.value = '';
    if (props.editBlock) {
      form.title = props.editBlock.title;
      form.type = props.editBlock.type;
      form.description = props.editBlock.description || '';
      
      const start = new Date(props.editBlock.start);
      const end = new Date(props.editBlock.end);
      
      form.startTime = start.toTimeString().slice(0, 5);
      form.endTime = end.toTimeString().slice(0, 5);
    } else {
      // New block defaults
      form.title = '';
      form.type = 'work';
      form.description = '';
      if (props.initialHour) {
          form.startTime = `${props.initialHour.toString().padStart(2, '0')}:00`;
          form.endTime = `${(props.initialHour + 1).toString().padStart(2, '0')}:00`;
      } else {
          form.startTime = '09:00';
          form.endTime = '10:00';
      }
    }
  }
});

function save() {
    if (form.startTime >= form.endTime) {
        error.value = 'La hora de fin debe ser posterior a la de inicio';
        return;
    }

    emit('save', {
        title: form.title || (types.find(t => t.value === form.type)?.label ?? 'Evento'),
        type: form.type,
        description: form.description,
        // Dates will be constructed by parent using the set time strings
        start: form.startTime, // Passing strings back, parent handles date object merging
        end: form.endTime
    });
}
</script>
