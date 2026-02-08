<template>
  <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
    <TherapistManagerHeader
      class="shrink-0"
      @create="openCreateModal"
    />

    <div class="min-h-0 flex-1 overflow-y-auto md:hidden">
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-6">
        <TherapistAvatarTile
          v-for="therapist in orderedTherapists"
          :key="therapist.id"
          :therapist="therapist"
          @edit="editTherapist(therapist)"
          @delete="deleteTherapist(therapist.id)"
        />
      </div>
    </div>

    <div class="hidden md:flex flex-1 min-h-0 overflow-y-auto">
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-6 sm:pb-8 w-full self-start">
        <TherapistCard
          v-for="therapist in orderedTherapists"
          :key="therapist.id"
          :therapist="therapist"
          :spa-name="getSpaName(therapist.spaId)"
          @edit="editTherapist(therapist)"
          @delete="deleteTherapist(therapist.id)"
        />
      </div>
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
  import TherapistManagerHeader from "@/components/therapist/TherapistManagerHeader.vue";
  import TherapistCard from "@/components/therapist/TherapistCard.vue";
  import TherapistAvatarTile from "@/components/therapist/TherapistAvatarTile.vue";
  import TherapistEditorModal from "@/components/therapist/TherapistEditorModal.vue";
  import { useTherapistManager } from "@/composables/useTherapistManager";

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
    getSpaName,
  } = useTherapistManager();
</script>
