<template>
  <section class="home">
    <h2>Vista Home</h2>

    <div class="home__card">
      <p>Contador: {{ count }}</p>
      <p>Doble: {{ doubled }}</p>
      <div class="home__actions">
        <BaseButton @click="decrement">-1</BaseButton>
        <BaseButton @click="increment">+1</BaseButton>
      </div>
    </div>

    <div class="home__card">
      <h3>Vue Query (cache)</h3>
      <p v-if="query.isLoading">Cargando...</p>
      <p v-else-if="query.isError">Error al cargar</p>
      <ul v-else>
        <li v-for="item in query.data" :key="item.id">
          {{ item.title }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

import BaseButton from '@/components/BaseButton.vue'
import { useCounter } from '@/composables/useCounter'

type DemoItem = {
  id: number
  title: string
}

const { count, doubled, increment, decrement } = useCounter(1)

const query = useQuery<DemoItem[]>({
  queryKey: ['demo-items'],
  queryFn: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    return [
      { id: 1, title: 'Cacheado en memoria' },
      { id: 2, title: 'Listo para integrar API real' },
    ]
  },
})
</script>

<style scoped>
.home {
  display: grid;
  gap: 24px;
}

.home__card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.home__actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
</style>
