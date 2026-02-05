<template>
  <div class="grid gap-3 text-sm font-semibold text-spa-white">
    <button
      v-for="action in actions"
      :key="action"
      class="rounded-2xl bg-spa-primary px-4 py-3 text-left transition hover:brightness-95"
      type="button"
    >
      {{ action }}
    </button>
  </div>
</template>

<script setup lang="ts">
type Props = {
  actions: string[]
}

defineProps<Props>()
</script>
