<template>
  <div class="rounded-2xl bg-spa-white/80 p-4">
    <p class="text-xs uppercase tracking-[0.2em] text-black/50">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold">{{ value }}</p>
    <p v-if="note" class="mt-1 text-xs text-black/50">{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
type Props = {
  label: string
  value: string
  note?: string
}

defineProps<Props>()
</script>
