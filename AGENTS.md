# 🏛️ Arquitectura de Agentes (Service Layer) - Vue 3 & TypeScript

Este documento define el estándar para la implementación de la capa de **Agents** (Agentes de API) en el proyecto, utilizando la **Composition API**, **pnpm**, y **Vitest**.

## 🎯 Principios de Ingeniería Aplicados

1.  **Single Responsibility (S):** Cada agente se encarga exclusivamente de la comunicación con un dominio de datos específico.
2.  **Inversión de Dependencias (D):** Los componentes no gestionan URLs ni lógica de red; consumen una interfaz reactiva.
3.  **Encapsulamiento:** El estado interno (`ref`) se expone como `readonly` para evitar mutaciones accidentales desde los componentes.
4.  **DRY & KISS:** Estructura minimalista que evita la redundancia mediante el uso de composables.

---

## 📂 Estructura del Módulo

```text
src/
 ├── types/              # Definiciones de interfaces (Contracts)
 ├── agents/             # Lógica de comunicación y estado reactivo
 │    ├── useUserAgent.ts
 │    └── __tests__/     # Pruebas unitarias con Vitest