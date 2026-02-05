<template>
  <button class="base-button" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'button',
  },
)
</script>

<style scoped>
.base-button {
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.base-button:hover {
  background: #1d4ed8;
}
</style>
