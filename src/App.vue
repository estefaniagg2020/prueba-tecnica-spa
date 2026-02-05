<template>
  <div class="app">
    <header class="app__header">
      <h1>Base Vue</h1>
      <nav class="app__nav">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/about">Acerca</RouterLink>
      </nav>
    </header>

    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.app {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a;
  background: #f8fafc;
  min-height: 100vh;
}

.app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.app__nav {
  display: flex;
  gap: 16px;
}

.app__main {
  padding: 24px;
}

.app__nav a {
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
}

.app__nav a.router-link-active {
  color: #2563eb;
}
</style>
