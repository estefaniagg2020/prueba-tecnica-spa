<template>
  <div class="h-full flex flex-col p-5 overflow-hidden">
    <DashboardHeader 
      :current-date="currentDate"
      :current-user-name="currentUserName"
      :current-user-photo="currentUserPhoto"
      :current-role="authStore.currentRole"
      :current-user-id="authStore.currentUserId"
      :therapists="therapistStore.therapists"
      @update:user="currentUserSelection = $event"
      @report="handleReport"
    />

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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
       <div class="lg:col-span-2 flex flex-col gap-5 h-full min-h-0">
          <RevenueChart :data="chartData" />

          <div class="grid grid-cols-2 gap-4 flex-shrink-0 h-24">
             <QuickActionCard 
               title="Centros" 
               subtitle="Salas y servicios" 
               icon="🏢" 
               variant="blue"
               @click="$router.push('/spas')"
             />
             <QuickActionCard 
               title="Equipo" 
               subtitle="Rendimiento" 
               icon="👥" 
               variant="purple"
               @click="$router.push('/therapists')"
             />
          </div>
       </div>

       <ActivityTimeline 
         :activities="recentActivity" 
         :tip="DASHBOARD_CONSTANTS.TIP_OF_THE_DAY" 
       />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useDashboard } from '@/composables/useDashboard';
import { DASHBOARD_CONSTANTS } from '@/data/constants';
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';
import RevenueChart from '@/components/dashboard/RevenueChart.vue';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline.vue';
import QuickActionCard from '@/components/dashboard/QuickActionCard.vue';

const $router = useRouter();
const {
  authStore,
  therapistStore,
  currentUserName,
  currentUserPhoto,
  currentUserSelection,
  currentDate,
  chartData,
  recentActivity,
  handleReport
} = useDashboard();
</script>
