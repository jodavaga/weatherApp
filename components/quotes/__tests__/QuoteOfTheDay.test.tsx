import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import QuoteOfTheDay from '../QuoteOfTheDay'
import { useQuote } from '../useQuote'

jest.mock('../useQuote')
const mockUseQuote = useQuote as jest.MockedFunction<typeof useQuote>

describe('QuoteOfTheDay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display quote info when load', () => {
    const mockQuote = {
      quote: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      tags: ['inspirational', 'success', 'work']
    }

    mockUseQuote.mockReturnValue({
      quote: mockQuote,
      loading: false,
      error: null,
      refreshQuote: jest.fn()
    })

    render(<QuoteOfTheDay />)

    expect(screen.getByText('Quote of the Day')).toBeInTheDocument()
    expect(screen.getByText('— Steve Jobs')).toBeInTheDocument()
    expect(screen.getByText('inspirational')).toBeInTheDocument()
    expect(screen.getByText('success')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
  })

  it('should show loading state on loading', () => {
    mockUseQuote.mockReturnValue({
      quote: null,
      loading: true,
      error: null,
      refreshQuote: jest.fn()
    })

    render(<QuoteOfTheDay />)

    expect(screen.getByText('Quote of the Day')).toBeInTheDocument()
    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('should display error message when fails', () => {
    mockUseQuote.mockReturnValue({
      quote: null,
      loading: false,
      error: 'Failed to fetch qoute',
      refreshQuote: jest.fn()
    })

    render(<QuoteOfTheDay />)

    expect(screen.getByText('Quote of the Day')).toBeInTheDocument()
    expect(screen.getByText('Unable to load quote')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch quote')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('should call refresh method when refresh is clicked', () => {
    const mockRefreshQuote = jest.fn()
    const mockQuote = {
      quote: 'Test quote',
      author: 'Test Author',
      tags: ['test']
    }

    mockUseQuote.mockReturnValue({
      quote: mockQuote,
      loading: false,
      error: null,
      refreshQuote: mockRefreshQuote
    })

    render(<QuoteOfTheDay />)

    const refreshButton = screen.getByText('Refresh')
    fireEvent.click(refreshButton)

    expect(mockRefreshQuote).toHaveBeenCalledTimes(1)
  })
})
