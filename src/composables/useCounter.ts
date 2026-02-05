import { computed, ref } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)

  const increment = () => {
    count.value += 1
  }

  const decrement = () => {
    count.value -= 1
  }

  const doubled = computed(() => count.value * 2)

  return {
    count,
    doubled,
    increment,
    decrement,
  }
}
