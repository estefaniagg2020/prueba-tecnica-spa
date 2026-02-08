<template>
  <Modal
    :is-open="isOpen"
    @close="$emit('close')"
  >
    <template #title>
      {{ editor.modalTitle }}
    </template>

    <form
      @submit.prevent="editor.save"
      class="space-y-4"
    >
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">{{ editor.labels.LABEL_TITLE }}</label>
        <input
          v-model="editor.form.title"
          type="text"
          :placeholder="editor.labels.PLACEHOLDER_TITLE"
          required
          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50 transition-all font-medium"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">{{ editor.labels.LABEL_ACTIVITY_TYPE }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            v-for="type in editor.types"
            :key="type.value"
            @click="editor.form.type = type.value"
            class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all flex items-center justify-center gap-2"
            :class="
              editor.form.type === type.value
                ? type.activeClass
                : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
            "
          >
            <span>{{ type.icon }}</span> {{ type.label }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">{{ editor.labels.LABEL_START }}</label>
          <input
            v-model="editor.form.startTime"
            type="time"
            required
            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">{{ editor.labels.LABEL_END }}</label>
          <input
            v-model="editor.form.endTime"
            type="time"
            required
            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">{{ editor.labels.LABEL_NOTES }}</label>
        <textarea
          v-model="editor.form.description"
          rows="2"
          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spa-teal/50"
        ></textarea>
      </div>

      <div
        v-if="editor.error"
        class="text-red-500 text-sm bg-red-50 p-2 rounded-lg"
      >
        {{ editor.error }}
      </div>

      <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <button
          v-if="editor.isEditing"
          type="button"
          @click="$emit('delete')"
          class="mr-auto text-red-400 hover:text-red-600 font-medium text-sm px-2"
        >
          {{ editor.labels.BTN_DELETE }}
        </button>
        <BaseButton
          variant="ghost"
          type="button"
          @click="$emit('close')"
          >{{ editor.labels.BTN_CANCEL }}</BaseButton
        >
        <BaseButton type="submit">{{ editor.submitLabel }}</BaseButton>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
  import Modal from "../common/Modal.vue";
  import BaseButton from "../common/BaseButton.vue";
  import type { ScheduleBlock } from "@/interfaces";
  import type { BlockEditorModalProps } from "@/interfaces/components";
  import { useBlockEditorForm } from "@/composables/useBlockEditorForm";

  const props = defineProps<BlockEditorModalProps>();

  const emit = defineEmits<{
    (e: "close"): void;
    (e: "save", data: Partial<ScheduleBlock>): void;
    (e: "delete"): void;
  }>();

  const editor = useBlockEditorForm(props, emit);
</script>
