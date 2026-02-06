<template>
  <div class="h-full flex flex-col p-5 overflow-hidden">
    <!-- Horizontal Navigation Header (Only for Dashboard) -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
       <div class="flex items-center gap-4">
         <div class="w-10 h-10 bg-gradient-to-tr from-spa-teal to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-spa-teal/20">
           🌿
         </div>
         <div>
            <h1 class="text-xl font-bold text-gray-800">SpaGest</h1>
            <p class="text-xs text-gray-500">{{ currentDate }}</p>
         </div>
       </div>

       <!-- Horizontal Menu -->
        <nav class="hidden md:flex items-center gap-6">
            <RouterLink to="/scheduler" class="flex items-center gap-2 text-gray-600 hover:text-spa-teal font-medium transition-colors">
                <span>📅</span> Agenda
            </RouterLink>
            <RouterLink to="/therapists" class="flex items-center gap-2 text-gray-600 hover:text-spa-teal font-medium transition-colors">
                <span>👥</span> Equipo
            </RouterLink>
            <RouterLink to="/spas" class="flex items-center gap-2 text-gray-600 hover:text-spa-teal font-medium transition-colors">
                <span>🏢</span> Centros
            </RouterLink>
        </nav>

       <!-- User Actions -->
       <div class="flex items-center gap-4">
         <div class="relative group">
            <button class="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-gray-100">
                <Avatar :name="currentUserName" :src="currentUserPhoto" :size="32" />
                <div class="text-left hidden sm:block">
                    <p class="text-sm font-bold text-gray-700 leading-tight">{{ currentUserName }}</p>
                    <p class="text-[10px] text-gray-500 uppercase">{{ authStore.currentRole }}</p>
                </div>
                <span class="text-xs text-gray-400">▼</span>
            </button>
            
            <!-- Custom Dropdown -->
            <div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform origin-top-right">
                <div class="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">Cambiar Usuario</div>
                
                <button 
                    @click="currentUserSelection = '5'"
                    class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    :class="authStore.currentUserId === '5' ? 'bg-teal-50/50' : ''"
                >
                    <Avatar name="Antonio" :size="28" /> <!-- Admin typically has check or specific avatar -->
                    <div>
                        <p class="text-sm font-bold text-gray-700">Antonio</p>
                        <p class="text-[10px] text-gray-500">Manager</p>
                    </div>
                </button>

                <div class="h-px bg-gray-100 my-1"></div>

                <div class="max-h-48 overflow-y-auto custom-scrollbar">
                    <button 
                        v-for="therapist in therapistStore.therapists" 
                        :key="therapist.id"
                        @click="currentUserSelection = therapist.id"
                        class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                         :class="authStore.currentUserId === therapist.id ? 'bg-teal-50/50' : ''"
                    >
                        <Avatar :name="therapist.name" :src="therapist.photoUrl" :size="28" />
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-gray-700 truncate">{{ therapist.name }}</p>
                            <p class="text-[10px] text-gray-500">{{ therapist.role }}</p>
                        </div>
                    </button>
                </div>
            </div>
         </div>
         
         <BaseButton variant="secondary" icon="📥" @click="handleReport" class="!p-2 !w-10 !h-10 !rounded-full flex items-center justify-center">
            <span class="sr-only">Reporte</span>
         </BaseButton>
       </div>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 flex-shrink-0">
       <MetricCard 
         title="Citas Hoy" 
         :value="12" 
         :trend="15"
         icon="📅" 
         icon-bg-class="bg-orange-100 text-orange-600"
         decorator-class="bg-orange-500"
       />
       <MetricCard 
         title="Ingresos (Est.)" 
         value="1.250€" 
         :trend="8"
         icon="💶" 
         icon-bg-class="bg-green-100 text-green-600"
         decorator-class="bg-green-500"
       />
       <MetricCard 
         title="Terapeutas Activos" 
         :value="therapistStore.therapists.length" 
         icon="👥" 
         icon-bg-class="bg-blue-100 text-blue-600"
         decorator-class="bg-blue-500"
       />
       <MetricCard 
         title="Ocupación" 
         value="85%" 
         :trend="-2"
         icon="📊" 
         icon-bg-class="bg-purple-100 text-purple-600"
         decorator-class="bg-purple-500"
       />
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
       
       <!-- Left: Chart/Activity -->
       <div class="lg:col-span-2 flex flex-col gap-5 h-full min-h-0">
          <!-- Revenue Chart (CSS Mock) -->
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
             <div class="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 class="text-lg font-bold text-gray-800">Ingresos Semanales</h3>
                <select class="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 px-2 py-1">
                   <option>Esta Semana</option>
                   <option>Mes Pasado</option>
                </select>
             </div>
             
             <!-- CSS Bar Chart visual -->
             <div class="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                <div v-for="(day, index) in chartData" :key="index" class="flex flex-col items-center gap-2 group w-full h-full justify-end">
                   <div 
                     class="w-full max-w-[40px] bg-spa-teal/20 rounded-t-lg relative group-hover:bg-spa-teal transition-colors duration-500"
                     :style="{ height: day.percent + '%' }"
                   >
                     <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10">
                        {{ day.value }}€
                     </div>
                   </div>
                   <span class="text-xs text-gray-400 font-medium">{{ day.label }}</span>
                </div>
             </div>
          </div>

          <!-- Quick Actions Row -->
          <div class="grid grid-cols-2 gap-4 flex-shrink-0 h-24">
             <div 
               @click="$router.push('/spas')"
               class="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-2xl border border-blue-100 cursor-pointer hover:shadow-md transition-all group flex items-center gap-4"
             >
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">🏢</div>
                <div>
                    <h4 class="font-bold text-gray-800">Centros</h4>
                    <p class="text-xs text-gray-500 mt-0.5">Salas y servicios</p>
                </div>
             </div>
             <div 
               @click="$router.push('/therapists')"
               class="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-2xl border border-purple-100 cursor-pointer hover:shadow-md transition-all group flex items-center gap-4"
             >
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">👥</div>
                <div>
                    <h4 class="font-bold text-gray-800">Equipo</h4>
                    <p class="text-xs text-gray-500 mt-0.5">Rendimiento</p>
                </div>
             </div>
          </div>
       </div>

       <!-- Right: Recent Activity -->
       <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">Actividad Reciente</h3>
          
          <div class="space-y-6 relative overflow-y-auto px-2 -mx-2 flex-1">
             <!-- Timeline Line -->
             <div class="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

             <div v-for="(item, i) in recentActivity" :key="i" class="flex gap-4 relative pl-2">
                <div class="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 z-10" :class="item.dotClass"></div>
                <div>
                   <p class="text-sm font-medium text-gray-800">{{ item.title }}</p>
                   <p class="text-xs text-gray-500 mt-0.5">{{ item.time }}</p>
                </div>
             </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
             <div class="bg-gray-50 rounded-xl p-3">
                <h4 class="text-xs font-bold text-gray-800 mb-1">💡 Tip del día</h4>
                <p class="text-[11px] text-gray-500 leading-relaxed">
                   Agrupa tratamientos similares en la misma sala para reducir tiempos.
                </p>
             </div>
          </div>
       </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTherapistStore } from '@/stores/therapist';
import BaseButton from '@/components/common/BaseButton.vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';

import Avatar from '@/components/common/Avatar.vue';

const authStore = useAuthStore();
const therapistStore = useTherapistStore();

onMounted(() => {
    therapistStore.initialize();
});

const currentUserName = computed(() => {
    if (authStore.currentUserId === '5' || authStore.currentUserId === 'admin') return 'Antonio';
    const t = therapistStore.getTherapistById(authStore.currentUserId || '');
    return t ? t.name : 'Usuario';
});

const currentUserPhoto = computed(() => {
     if (authStore.currentUserId === '5' || authStore.currentUserId === 'admin') return ''; // Antonio has no photo defined in store logic usually, or I should fetch it. Let's assume initials for admin.
     const t = therapistStore.getTherapistById(authStore.currentUserId || '');
     return t ? t.photoUrl : '';
});

const currentUserSelection = computed({
    get: () => {
        // Map '5' (Antonio's default ID) to 'admin' option value for UI consistency if needed, 
        // OR simply ensure '5' works. Since option value is 'admin' below...
        // Wait, I should make the option value '5' for consistency.
        if (authStore.currentUserId === '5') return '5'; 
        return authStore.currentUserId || '5';
    },
    set: (val: string) => {
        if (val === '5') { // Antonio
            authStore.setUser('manager', '5');
        } else {
            const therapist = therapistStore.getTherapistById(val);
            if (therapist) {
                const role = therapist.role === 'manager' ? 'manager' : 'employee';
                authStore.setUser(role, therapist.id);
            }
        }
    }
});

function handleReport() {
    alert('Generando reporte semanal... (Funcionalidad Simulada)');
}


const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const chartData = [
  { label: 'Lun', value: 850, percent: 40 },
  { label: 'Mar', value: 1200, percent: 65 },
  { label: 'Mié', value: 950, percent: 50 },
  { label: 'Jue', value: 1500, percent: 80 },
  { label: 'Vie', value: 1800, percent: 95 },
  { label: 'Sáb', value: 2100, percent: 100 }, // Max
  { label: 'Dom', value: 600, percent: 30 },
];

const recentActivity = [
  { title: 'Nueva cita: Masaje Relajante', time: 'Hace 10 min', dotClass: 'bg-green-500' },
  { title: 'Antonio actualizó su horario', time: 'Hace 45 min', dotClass: 'bg-blue-500' },
  { title: 'Cancelación: Sala 3', time: 'Hace 2 horas', dotClass: 'bg-red-400' },
  { title: 'Nuevo cliente registrado', time: 'Hace 3 horas', dotClass: 'bg-orange-400' },
  { title: 'Cierre de caja diario', time: 'Ayer, 21:00', dotClass: 'bg-gray-400' },
];
</script>
