<template>
  <header class="border-b border-black/10 bg-spa-olive">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-black/50">{{ eyebrow }}</p>
        <h1 class="text-2xl font-semibold">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-black/50">{{ subtitle }}</p>
      </div>
      <button
        class="rounded-full bg-spa-primary px-5 py-2 text-sm font-semibold text-spa-white shadow-sm transition hover:brightness-95"
        type="button"
      >
        {{ ctaLabel }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
type Props = {
  title: string
  eyebrow?: string
  subtitle?: string
  ctaLabel?: string
}

withDefaults(defineProps<Props>(), {
  eyebrow: 'Dashboard',
  subtitle: '',
  ctaLabel: 'Nuevo reporte',
})
</script>
