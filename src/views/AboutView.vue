<template>
  <main class="mx-auto max-w-4xl px-6 py-10">
    <BaseCard>
      <h2 class="text-2xl font-semibold">Instrucciones del proyecto</h2>
      <p class="mt-2 text-sm text-black/60">
        Este proyecto es una base en Vue 3 + Vite + TypeScript para una SPA con arquitectura limpia
        y capa de agentes.
      </p>

      <div class="mt-6 space-y-4 text-sm text-black/70">
        <div>
          <p class="font-semibold">Cómo ejecutar</p>
          <ul class="mt-2 space-y-1">
            <li><span class="font-semibold">pnpm install</span> para instalar dependencias.</li>
            <li><span class="font-semibold">pnpm dev</span> para levantar el entorno local.</li>
            <li>La app se abre en la URL que indique Vite (por defecto `http://localhost:5173`).</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold">Estructura base</p>
          <ul class="mt-2 space-y-1">
            <li><span class="font-semibold">src/main.ts</span>: punto de entrada.</li>
            <li><span class="font-semibold">src/App.vue</span>: componente raíz.</li>
            <li><span class="font-semibold">src/router</span>: rutas.</li>
            <li><span class="font-semibold">src/views</span>: páginas SPA.</li>
            <li><span class="font-semibold">src/components</span>: UI reusable.</li>
            <li><span class="font-semibold">src/composables</span>: lógica reutilizable.</li>
            <li><span class="font-semibold">src/stores</span>: estado global (Pinia).</li>
            <li><span class="font-semibold">src/lib</span>: configuración y utilidades.</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold">Capa de agentes (AGENTS)</p>
          <ul class="mt-2 space-y-1">
            <li>Cada agente se encarga de un dominio de datos específico.</li>
            <li>Los componentes consumen una interfaz reactiva, no URLs ni lógica de red.</li>
            <li>El estado interno se expone como `readonly`.</li>
            <li>Se prioriza una estructura simple, sin redundancia.</li>
          </ul>
        </div>
      </div>
    </BaseCard>
  </main>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
</script>
