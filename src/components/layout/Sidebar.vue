<template>
    <aside 
      class="h-full py-4 pl-4 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
      :class="isCollapsed ? 'w-20' : 'w-72'"
    >
      <!-- Collapse Button (Moved outside to avoid clipping) -->
      <button 
        @click="isCollapsed = !isCollapsed"
        class="absolute -right-3 top-12 w-6 h-6 bg-white border border-gray-100 rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-spa-primary hover:scale-110 transition-all z-40 cursor-pointer"
      >
        <span class="text-[10px]">{{ isCollapsed ? '▶' : '◀' }}</span>
      </button>

      <div class="h-full bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100/80 flex flex-col relative overflow-hidden backdrop-blur-xl">
          <!-- Logo Section -->
          <div class="p-6 flex items-center gap-3 mb-2">
            <div class="w-10 h-10 min-w-[2.5rem] bg-gradient-to-tr from-spa-primary to-spa-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-spa-primary/20">
              🌿
            </div>
            <div 
                class="overflow-hidden transition-all duration-300"
                :class="isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
            >
                <h1 class="text-xl font-bold text-gray-800 tracking-tight">SpaGest</h1>
                <p class="text-[10px] text-gray-400 tracking-widest uppercase font-medium">By Spalopia</p>
            </div>
          </div>
    
          <!-- Navigation -->
          <nav class="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
            
            <!-- Group: Main -->
            <div class="space-y-1">
                <div 
                    class="px-3 text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 transition-opacity duration-200"
                    :class="isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'"
                >
                    Principal
                </div>
                
                <NavItem to="/" icon="🏠" label="Inicio" :collapsed="isCollapsed" />
                <NavItem to="/scheduler" icon="📅" label="Agenda" :collapsed="isCollapsed" active-class="bg-orange-50 text-orange-600" />
            </div>
    
            <!-- Group: Management -->
            <div class="space-y-1">
                <div 
                    class="px-3 text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 transition-opacity duration-200"
                    :class="isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'"
                >
                    Gestión
                </div>
    
                <NavItem to="/therapists" icon="👥" label="Equipo" :collapsed="isCollapsed" active-class="bg-teal-50 text-teal-600" />
                <NavItem to="/spas" icon="🏢" label="Centros Spa" :collapsed="isCollapsed" active-class="bg-blue-50 text-blue-600" />
            </div>
    
          </nav>
    
          <!-- User Profile -->
          <div class="p-3 mt-auto">
            <div 
                @click="authStore.toggleRole()"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-100 group"
                :class="isCollapsed ? 'justify-center' : ''"
            >
                <Avatar :name="authStore.currentRole === 'manager' ? 'Manager' : 'Employee'" :size="36" class="ring-2 ring-white shadow-sm" />
                <div 
                    class="overflow-hidden transition-all duration-300"
                    :class="isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'"
                >
                    <p class="text-sm font-bold text-gray-700 capitalize">{{ authStore.currentRole }}</p>
                    <p class="text-xs text-gray-400 group-hover:text-spa-primary transition-colors">Cambiar Rol ⚡</p>
                </div>
            </div>
          </div>
      </div>
    </aside>
    </template>
    
    <script setup lang="ts">
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import Avatar from '../common/Avatar.vue';
    import NavItem from './NavItem.vue'; // We'll create this helper
    
    const isCollapsed = ref(false);
    const authStore = useAuthStore();
    </script>
    
    <style scoped>
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #f1f1f1;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #e5e7eb;
    }
    </style>
