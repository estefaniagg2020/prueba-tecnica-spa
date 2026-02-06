<template>
    <div class="h-full flex flex-col p-6 overflow-y-auto">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Gestión de Spas</h2>
                <p class="text-gray-500 text-sm">Administra las sucursales, equipos y servicios.</p>
            </div>
            <BaseButton variant="primary" icon="+" @click="openCreateModal">
                Añadir Spa
            </BaseButton>
        </div>

        <!-- Spa List -->
        <div class="space-y-6">
            <div 
                v-for="spa in spaStore.spas" 
                :key="spa.id"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <!-- Spa Header (Always visible) -->
                <div class="p-6 flex items-start justify-between bg-gray-50/30">
                    <div class="flex items-center gap-4">
                        <div 
                            class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                            :class="getThemeClasses(spa.themeColor)"
                        >
                            🏢
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">{{ spa.name }}</h3>
                            <div class="flex gap-2 text-xs font-medium text-gray-500 mt-1">
                                <span class="bg-gray-100 px-2 py-0.5 rounded-full">ID: {{ spa.id }}</span>
                                <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    👥 {{ getTherapistCount(spa.id) }} Terapeutas
                                </span>
                                <span class="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    ✨ {{ (spa.serviceIds || []).length }} Servicios
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button @click="editSpa(spa)" class="p-2 text-gray-400 hover:text-spa-teal hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Editar">
                            ✏️
                        </button>
                        <button @click="confirmDelete(spa.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </div>

                <!-- Content Columns -->
                <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                    <!-- Left: Therapists -->
                    <div class="p-6">
                        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Equipo Asignado</h4>
                        <div v-if="getTherapistsForSpa(spa.id).length > 0" class="flex flex-wrap gap-3">
                            <div 
                                v-for="therapist in getTherapistsForSpa(spa.id)" 
                                :key="therapist.id"
                                class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 w-full sm:w-auto"
                            >
                                <Avatar 
                                    :src="therapist.photoUrl" 
                                    :name="therapist.name" 
                                    :size="32"
                                    class="border border-white shadow-sm"
                                />
                                <div class="text-sm">
                                    <div class="font-medium text-gray-800">{{ therapist.name.split(' ')[0] }}</div>
                                    <div class="text-[10px] text-gray-500">{{ therapist.role }}</div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-sm text-gray-400 italic py-2">
                            No hay terapeutas asignados. Ve a "Gestión Terapeutas" para asignar.
                        </div>
                    </div>

                    <!-- Right: Available Services -->
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                             <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Servicios Ofrecidos</h4>
                             <button @click="toggleServiceModal(spa)" class="text-xs text-spa-teal font-medium hover:underline">
                                + Gestionar Servicios
                             </button>
                        </div>
                        
                        <div class="space-y-3">
                             <div v-for="category in categories" :key="category.value">
                                 <div v-if="getServicesForSpaByCategory(spa, category.value).length > 0">
                                     <h5 class="text-xs font-bold text-gray-500 mb-2 mt-3 flex items-center gap-1">
                                         {{ category.icon }} {{ category.label }}
                                     </h5>
                                     <div class="flex flex-wrap gap-2">
                                         <span 
                                             v-for="service in getServicesForSpaByCategory(spa, category.value)" 
                                             :key="service.id"
                                             class="text-xs px-2 py-1 rounded border bg-white text-gray-600"
                                             :class="category.borderClass"
                                         >
                                             {{ service.name }}
                                         </span>
                                     </div>
                                 </div>
                             </div>
                             <div v-if="(!spa.serviceIds || spa.serviceIds.length === 0)" class="text-sm text-gray-400 italic">
                                 No hay servicios habilitados en este centro.
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Spa Edit/Create Modal -->
        <Modal 
            :is-open="isModalOpen" 
            :title="isEditing ? 'Editar Spa' : 'Nuevo Spa'" 
            @close="closeModal"
        >
            <form @submit.prevent="saveSpa" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Spa</label>
                    <input 
                        v-model="form.name"
                        type="text" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spa-teal/20 focus:border-spa-teal"
                        placeholder="Ej: Spa Madrid Centro"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Color del Tema</label>
                    <div class="flex gap-3 mt-2">
                        <button 
                            type="button"
                            v-for="color in themeColors" 
                            :key="color.value"
                            @click="form.themeColor = color.value"
                            class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                            :class="[
                                color.bgClass,
                                form.themeColor === color.value ? 'border-gray-600 scale-110' : 'border-transparent'
                            ]"
                            :title="color.label"
                        >
                           <span v-if="form.themeColor === color.value" class="text-white text-xs">✓</span>
                        </button>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                    <BaseButton variant="secondary" @click="closeModal" type="button">
                        Cancelar
                    </BaseButton>
                    <BaseButton variant="primary" type="submit">
                        {{ isEditing ? 'Guardar Cambios' : 'Crear Spa' }}
                    </BaseButton>
                </div>
            </form>
        </Modal>

        <!-- Service Management Modal -->
        <Modal
            :is-open="isServiceModalOpen"
            title="Gestionar Servicios del Spa"
            @close="closeServiceModal"
        >
            <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="category in categories" :key="category.value" class="mb-6">
                    <h5 class="font-bold text-gray-800 mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
                        {{ category.icon }} {{ category.label }}
                    </h5>
                    <div class="space-y-2">
                        <label 
                            v-for="service in serviceStore.getServicesByCategory(category.value)" 
                            :key="service.id" 
                            class="flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:bg-gray-50"
                             :class="selectedServiceIds.includes(service.id) ? 'border-spa-teal bg-spa-teal/5' : 'border-gray-200'"
                        >
                            <div class="flex items-start gap-3">
                                <input 
                                    type="checkbox" 
                                    :value="service.id" 
                                    v-model="selectedServiceIds"
                                    class="mt-1 rounded text-spa-teal focus:ring-spa-teal"
                                />
                                <div>
                                    <div class="font-medium text-sm text-gray-900">{{ service.name }}</div>
                                    <div class="text-xs text-gray-500">{{ service.duration }} min • {{ service.price }}€</div>
                                </div>
                            </div>
                            <span v-if="service.requiresCabin" class="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Cabina</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                 <BaseButton variant="secondary" @click="closeServiceModal">Cancelar</BaseButton>
                 <BaseButton variant="primary" @click="saveServices">Guardar Selección</BaseButton>
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSpaStore } from '@/stores/spa';
import { useTherapistStore } from '@/stores/therapist';
import { useServiceStore } from '@/stores/service';
import type { Spa, ServiceCategory } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';
import Modal from '@/components/common/Modal.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useToast } from '@/composables/useToast';

const spaStore = useSpaStore();
const therapistStore = useTherapistStore();
const serviceStore = useServiceStore();
const { addToast } = useToast();

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

// Service Modal Logic
const isServiceModalOpen = ref(false);
const editingSpaId = ref<string | null>(null);
const selectedServiceIds = ref<string[]>([]);

const form = reactive({
    name: '',
    themeColor: 'teal'
});

const themeColors = [
    { value: 'teal', label: 'Teal', bgClass: 'bg-spa-teal' },
    { value: 'purple', label: 'Purple', bgClass: 'bg-purple-500' },
    { value: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
    { value: 'orange', label: 'Orange', bgClass: 'bg-orange-500' },
    { value: 'pink', label: 'Pink', bgClass: 'bg-pink-500' }
];

const categories: { value: ServiceCategory; label: string; icon: string; borderClass: string }[] = [
    { value: 'manual', label: 'Tratamientos Manuales', icon: '🤲', borderClass: 'border-orange-200' },
    { value: 'hydrotherapy', label: 'Hidroterapia', icon: '💧', borderClass: 'border-blue-200' },
    { value: 'aesthetic', label: 'Estética', icon: '💅', borderClass: 'border-pink-200' },
    { value: 'wellness', label: 'Bienestar y Salud', icon: '🧘', borderClass: 'border-green-200' },
];

onMounted(() => {
    spaStore.initialize();
    therapistStore.initialize();
    // serviceStore is static for now, no init needed
});

function getThemeClasses(color: string) {
    switch(color) {
        case 'teal': return 'bg-spa-teal shadow-spa-teal/20';
        case 'purple': return 'bg-purple-500 shadow-purple-500/20';
        case 'blue': return 'bg-blue-500 shadow-blue-500/20';
        case 'orange': return 'bg-orange-500 shadow-orange-500/20';
        case 'pink': return 'bg-pink-500 shadow-pink-500/20';
        default: return 'bg-gray-500';
    }
}

function getTherapistCount(spaId: string) {
    return therapistStore.therapists.filter(t => t.spaId === spaId).length;
}

function getTherapistsForSpa(spaId: string) {
    return therapistStore.therapists.filter(t => t.spaId === spaId);
}

function getServicesForSpaByCategory(spa: Spa, category: string) {
    if (!spa.serviceIds) return [];
    const categoryServices = serviceStore.getServicesByCategory(category);
    return categoryServices.filter(s => spa.serviceIds?.includes(s.id));
}

function resetForm() {
    form.name = '';
    form.themeColor = 'teal';
}

function openCreateModal() {
    isEditing.value = false;
    editingId.value = null;
    resetForm();
    isModalOpen.value = true;
}

function editSpa(spa: Spa) {
    isEditing.value = true;
    editingId.value = spa.id;
    form.name = spa.name;
    form.themeColor = spa.themeColor || 'teal';
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    resetForm();
    editingId.value = null;
    isEditing.value = false;
}

function saveSpa() {
    if (isEditing.value && editingId.value) {
        spaStore.updateSpa(editingId.value, { ...form });
        addToast('Spa actualizado correctamente', 'success');
    } else {
        spaStore.addSpa({ ...form, themeColor: form.themeColor });
        addToast('Spa creado con éxito', 'success');
    }
    closeModal();
}

function confirmDelete(id: string) {
    const count = getTherapistCount(id);
    if (count > 0) {
        alert(`No puedes eliminar este Spa porque tiene ${count} terapeutas asignados. Reasígnalos primero.`);
        return;
    }

    if (confirm('¿Estás seguro de eliminar este Spa?')) {
        spaStore.deleteSpa(id);
        addToast('Spa eliminado', 'success');
    }
}

// Service Management Functions
function toggleServiceModal(spa: Spa) {
    editingSpaId.value = spa.id;
    selectedServiceIds.value = [...(spa.serviceIds || [])];
    isServiceModalOpen.value = true;
}

function closeServiceModal() {
    isServiceModalOpen.value = false;
    editingSpaId.value = null;
    selectedServiceIds.value = [];
}

function saveServices() {
    if (editingSpaId.value) {
        spaStore.updateSpa(editingSpaId.value, { serviceIds: selectedServiceIds.value });
        addToast('Servicios actualizados', 'success');
        closeServiceModal();
    }
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
