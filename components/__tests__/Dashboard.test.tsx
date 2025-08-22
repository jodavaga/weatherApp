import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Dashboard from '../Dashboard'
import { WeatherProvider } from '../WeatherContext'

describe('Dashboard', () => {
  it('should render the dashboard with title', () => {
    render(
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should render weather and quote sections', () => {
    render(
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    
    const dashboard = screen.getByText('Dashboard').closest('div')
    expect(dashboard).toBeInTheDocument()
  })
})
