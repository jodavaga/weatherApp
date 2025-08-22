import '@testing-library/jest-dom'
import { renderHook } from '@testing-library/react'
import { useQuote } from '../useQuote'

describe('useQuote', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the expected hook structure', () => {
    const { result } = renderHook(() => useQuote())

    expect(result.current).toHaveProperty('quote')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('refreshQuote')
    expect(typeof result.current.refreshQuote).toBe('function')
  })

  it('should start with loading state', () => {
    const { result } = renderHook(() => useQuote())

    expect(result.current.loading).toBe(true)
    expect(result.current.quote).toBe(null)
    expect(result.current.error).toBe(null)
  })
})
