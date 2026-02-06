<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Terapeutas</h2>
        <p class="text-gray-500">Gestiona el equipo de profesionales</p>
      </div>
      <BaseButton @click="openCreateModal">
        <template #icon><span>+</span></template>
        Nuevo Terapeuta
      </BaseButton>
    </div>

    <!-- Grid List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8">
      <div 
        v-for="therapist in store.therapists" 
        :key="therapist.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative"
      >
        <div class="p-6 flex flex-col items-center">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button @click="editTherapist(therapist)" class="p-1.5 bg-gray-100 rounded-full text-gray-600 hover:text-spa-teal">✏️</button>
                <button @click="deleteTherapist(therapist.id)" class="p-1.5 bg-gray-100 rounded-full text-red-400 hover:text-red-600">🗑️</button>
            </div>

            <Avatar :src="therapist.photoUrl" :name="therapist.name" :size="80" class="mb-4" />
            
            <h3 class="text-lg font-bold text-gray-900">{{ therapist.name }}</h3>
            <div class="flex flex-col items-center gap-1 mt-1 mb-4">
                <span class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full">{{ therapist.role === 'manager' ? 'Manager' : 'Terapeuta' }}</span>
                <span v-if="therapist.spaId" class="text-[10px] font-medium px-2 py-0.5 bg-spa-teal/10 text-spa-teal rounded-full">{{ getSpaName(therapist.spaId) }}</span>
            </div>
            
            <div class="w-full space-y-2 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                    <span class="text-spa-teal">📧</span> {{ therapist.email }}
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-spa-teal">📱</span> {{ therapist.phoneNumber }}
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-spa-teal">⏱️</span> {{ therapist.weeklyHours }}h / semana
                </div>
            </div>
        </div>
        <div class="h-2 w-full" :style="{ backgroundColor: therapist.color }"></div>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Modal :is-open="isModalOpen" @close="closeModal">
        <template #title>
            {{ isEditing ? 'Editar Terapeuta' : 'Nuevo Terapeuta' }}
        </template>
        
        <form @submit.prevent="saveTherapist" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="form.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input v-model="form.phoneNumber" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Spa Asignado</label>
                <select v-model="form.spaId" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal">
                    <option v-for="spa in spaStore.spas" :key="spa.id" :value="spa.id">{{ spa.name }}</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Horas Semanales</label>
                    <input v-model.number="form.weeklyHours" type="number" min="1" max="168" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal">
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
                     <input v-model="form.photoUrl" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal">
                </div>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
                <BaseButton variant="ghost" type="button" @click="closeModal">Cancelar</BaseButton>
                <BaseButton type="submit">{{ isEditing ? 'Guardar Cambios' : 'Crear Terapeuta' }}</BaseButton>
            </div>
        </form>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useTherapistStore } from '@/stores/therapist';
import { useSpaStore } from '@/stores/spa';
import type { Therapist } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';
import Modal from '@/components/common/Modal.vue';
import Avatar from '@/components/common/Avatar.vue';

const store = useTherapistStore();
const spaStore = useSpaStore();
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
    name: '',
    email: '',
    phoneNumber: '',
    weeklyHours: 40,
    photoUrl: '',
    role: 'therapist' as 'therapist' | 'manager',
    spaId: ''
});

onMounted(() => {
    store.initialize();
    spaStore.initialize();
});

function resetForm() {
    form.name = '';
    form.email = '';
    form.phoneNumber = '';
    form.weeklyHours = 40;
    form.photoUrl = '';
    form.role = 'therapist';
    form.spaId = spaStore.spas[0]?.id || '';
}

function openCreateModal() {
    isEditing.value = false;
    editingId.value = null;
    resetForm();
    // Set default random avatar for convenience
    form.photoUrl = `https://i.pravatar.cc/150?u=${Date.now()}`;
    isModalOpen.value = true;
}

function editTherapist(therapist: Therapist) {
    isEditing.value = true;
    editingId.value = therapist.id;
    form.name = therapist.name;
    form.email = therapist.email;
    form.phoneNumber = therapist.phoneNumber;
    form.weeklyHours = therapist.weeklyHours;
    form.photoUrl = therapist.photoUrl;
    form.role = therapist.role as 'therapist' | 'manager'; 
    form.spaId = therapist.spaId || spaStore.spas[0]?.id; // Fallback if old data missing spaId
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function saveTherapist() {
    // Ensure spaId is set even if not changed (though resetForm sets it)
    if (!form.spaId && spaStore.spas.length > 0) {
        form.spaId = spaStore.spas[0].id;
    }

    if (isEditing.value && editingId.value) {
        store.updateTherapist(editingId.value, { ...form });
    } else {
        store.addTherapist({ ...form });
    }
    closeModal();
}

function deleteTherapist(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este terapeuta?')) {
        store.deleteTherapist(id);
    }
}

function getSpaName(id: string) {
    const spa = spaStore.getSpaById(id);
    return spa ? spa.name : 'Sin Spa';
}
</script>
