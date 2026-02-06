import { defineStore } from 'pinia';
import { ref } from 'vue';

export type UserRole = 'manager' | 'employee';

export const useAuthStore = defineStore('auth', () => {
  const currentRole = ref<UserRole>('manager'); // Default to manager
  const currentUserId = ref<string | null>('5'); // Default to Antonio (Manager)

  function setRole(role: UserRole) {
    currentRole.value = role;
  }

  function setUser(role: UserRole, userId: string | null) {
      currentRole.value = role;
      currentUserId.value = userId;
  }

  function toggleRole() {
    currentRole.value = currentRole.value === 'manager' ? 'employee' : 'manager';
    // If switching to manager, default to Antonio (5). If employee, default to Vicente (1) for demo
    currentUserId.value = currentRole.value === 'manager' ? '5' : '1'; 
  }

  return {
    currentRole,
    currentUserId,
    setRole,
    setUser,
    toggleRole
  };
});
