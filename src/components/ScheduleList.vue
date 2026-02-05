<template>
  <ul class="space-y-3 text-sm text-black/70">
    <li
      v-for="item in items"
      :key="`${item.time}-${item.title}`"
      class="flex items-center justify-between rounded-2xl bg-spa-peach/50 px-4 py-3"
    >
      <span>{{ item.time }} - {{ item.title }}</span>
      <span class="text-xs font-semibold">{{ item.room }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
export type ScheduleItem = {
  time: string
  title: string
  room: string
}

type Props = {
  items: ScheduleItem[]
}

defineProps<Props>()
</script>
