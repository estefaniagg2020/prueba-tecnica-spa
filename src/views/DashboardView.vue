<template>
  <div>
    <DashboardHeader title="Prueba Tecnica Estefania Garcia" subtitle="Bienvenido" />

    <main class="mx-auto max-w-4xl px-6 py-12">
      <BaseCard class="bg-spa-peach/70">
        <p class="text-sm uppercase tracking-[0.3em] text-black/50">Bienvenido</p>
        <h2 class="mt-3 text-3xl font-semibold">Prueba Tecnica Estefania Garcia</h2>
        <p class="mt-2 text-sm text-black/60">
          Dashboard inicial listo para continuar con la integración y pruebas.
        </p>

        <div class="mt-6 space-y-3 text-sm text-black/70">
          <p>Lee las instrucciones del proyecto y la arquitectura de agentes en la vista About.</p>
          <RouterLink
            class="inline-flex items-center gap-2 rounded-full bg-spa-primary px-5 py-2 text-sm font-semibold text-spa-white shadow-sm transition hover:brightness-95"
            to="/about"
          >
            Ver instrucciones del proyecto
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </BaseCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'
</script>
