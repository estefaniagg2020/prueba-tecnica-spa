<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative min-w-0 flex flex-col h-full"
  >
    <div class="p-4 sm:p-6 flex flex-col items-center flex-1 min-h-0">
      <div class="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          @click="$emit('edit')"
          class="p-1.5 bg-gray-100 rounded-full text-gray-600 hover:text-spa-teal"
        >
          ✏️
        </button>
        <button
          type="button"
          @click="$emit('delete')"
          class="p-1.5 bg-gray-100 rounded-full text-red-400 hover:text-red-600"
        >
          🗑️
        </button>
      </div>

      <div class="flex flex-col items-center w-full min-h-46 sm:min-h-48">
        <Avatar
          :src="therapist.photoUrl"
          :name="therapist.name"
          :size="80"
          :href="therapist.linkedInUrl"
          class="mb-4"
        />
        <h3 class="text-lg font-bold text-gray-900 text-center w-full min-w-0 px-1 line-clamp-2" :title="therapist.name">{{ therapist.name }}</h3>
        <div class="flex flex-col items-center gap-1 mt-1">
          <span class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
            {{ roleLabel }}
          </span>
          <span
            v-if="therapist.spaId"
            class="text-[10px] font-medium px-2 py-0.5 bg-spa-teal/10 text-spa-teal rounded-full"
          >
            {{ spaName }}
          </span>
        </div>
      </div>

      <div class="w-full min-w-0 pt-4 mt-0 border-t border-gray-100 space-y-2 text-sm text-gray-600">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-spa-teal shrink-0">📧</span>
          <span class="truncate" :title="therapist.email">{{ therapist.email }}</span>
        </div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-spa-teal shrink-0">📱</span>
          <span class="truncate" :title="therapist.phoneNumber">{{ therapist.phoneNumber }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-spa-teal">⏱️</span> {{ therapist.weeklyHours }}{{ THERAPIST_MANAGER.HOURS_SUFFIX }}
        </div>
      </div>
    </div>
    <div class="h-2 w-full shrink-0" :style="{ backgroundColor: therapist.color }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Therapist } from '@/interfaces';
import Avatar from '@/components/common/Avatar.vue';
import { THERAPIST_MANAGER } from '@/data/constants';

const props = defineProps<{
  therapist: Therapist;
  spaName: string;
}>();

defineEmits<{ edit: []; delete: [] }>();

const roleLabel = computed(() =>
  props.therapist.role === 'manager' ? THERAPIST_MANAGER.ROLE_MANAGER : THERAPIST_MANAGER.ROLE_THERAPIST
);
</script>
