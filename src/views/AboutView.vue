<template>
  <section class="about">
    <h2>Vista About</h2>
    <p>
      Este proyecto está orientado a una arquitectura limpia con capas simples
      y separación por responsabilidades.
    </p>

    <ul>
      <li>`views/`: páginas SPA</li>
      <li>`components/`: UI reusable</li>
      <li>`composables/`: lógica reutilizable</li>
      <li>`stores/`: estado global (Pinia)</li>
      <li>`lib/`: configuración y utilidades</li>
    </ul>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.about {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.about ul {
  margin-top: 12px;
}
</style>
