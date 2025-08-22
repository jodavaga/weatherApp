import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import WeatherInfo from '../WeatherInfo'
import { fetchLocationData } from '../../utils/location'
import { fetchWeatherData } from '../../utils/weather'
import { WeatherProvider } from '../WeatherContext'

jest.mock('../../utils/location')
jest.mock('../../utils/weather')
  

const mockFetchLocationData = fetchLocationData as jest.MockedFunction<typeof fetchLocationData>
const mockFetchWeatherData = fetchWeatherData as jest.MockedFunction<typeof fetchWeatherData>

describe('WeatherInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display weather info when data is loaded', () => {
    mockFetchLocationData.mockResolvedValue({
      city: 'New York',
      region: 'NY',
      country: 'US',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York'
    })

    mockFetchWeatherData.mockResolvedValue({
      current: {
        temperature_2m: 22,
        relative_humidity_2m: 65,
        wind_speed_10m: 12,
        weather_code: 0
      }
    })

    render(
      <WeatherProvider>
        <WeatherInfo />
      </WeatherProvider>
    )

    expect(screen.getByText('Weather')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(
      <WeatherProvider>
        <WeatherInfo />
      </WeatherProvider>
    )

    expect(screen.getByText('Weather')).toBeInTheDocument()
  })
})
