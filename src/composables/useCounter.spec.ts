import { describe, expect, it } from 'vitest'

import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('increments and decrements', () => {
    const { count, increment, decrement } = useCounter(2)

    increment()
    increment()
    decrement()

    expect(count.value).toBe(3)
  })
})
