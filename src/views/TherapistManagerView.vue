<template>
  <div class="h-full flex flex-col min-h-0">
    <TherapistManagerHeader @create="openCreateModal" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-y-auto pb-6 sm:pb-8">
      <TherapistCard
        v-for="therapist in orderedTherapists"
        :key="therapist.id"
        :therapist="therapist"
        :spa-name="getSpaName(therapist.spaId)"
        @edit="editTherapist(therapist)"
        @delete="deleteTherapist(therapist.id)"
      />
    </div>

    <TherapistEditorModal
      :is-open="isModalOpen"
      :is-editing="isEditing"
      :form="form"
      :spas="spaStore.spas"
      @close="closeModal"
      @save="saveTherapist"
    />
  </div>
</template>

<script setup lang="ts">
import TherapistManagerHeader from '@/components/therapist/TherapistManagerHeader.vue';
import TherapistCard from '@/components/therapist/TherapistCard.vue';
import TherapistEditorModal from '@/components/therapist/TherapistEditorModal.vue';
import { useTherapistManager } from '@/composables/useTherapistManager';

const {
  orderedTherapists,
  isModalOpen,
  isEditing,
  form,
  spaStore,
  openCreateModal,
  editTherapist,
  closeModal,
  saveTherapist,
  deleteTherapist,
  getSpaName
} = useTherapistManager();
</script>
