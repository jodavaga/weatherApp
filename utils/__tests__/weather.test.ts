import '@testing-library/jest-dom'
import { 
  getWeatherCondition, 
  fetchWeatherData, 
  transformWeatherData,
  getWeatherBackground,
  getWeatherTextColor,
  type OpenMeteoResponse,
  type WeatherData 
} from '../weather'

describe('Weather Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWeatherCondition', () => {
    it('should return correct condition and icon for clear sky', () => {
      const result = getWeatherCondition(0)
      expect(result.condition).toBe('Clear sky')
      expect(result.icon).toBe('☀️')
    })

    it('should return correct condition and icon for rain', () => {
      const result = getWeatherCondition(61)
      expect(result.condition).toBe('Rain')
      expect(result.icon).toBe('🌧️')
    })
  })

  describe('fetchWeatherData', () => {
    it('should fetch weather data successfully', async () => {
      const mockResponse = {
        current: {
          temperature_2m: 22,
          relative_humidity_2m: 65,
          wind_speed_10m: 12,
          weather_code: 0
        }
      }

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await fetchWeatherData(40.7128, -74.0060, 'America/New_York')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('transformWeatherData', () => {
    it('should transform weather data correctly', () => {
      const mockData: OpenMeteoResponse = {
        current: {
          temperature_2m: 22.5,
          relative_humidity_2m: 65,
          wind_speed_10m: 12.3,
          weather_code: 0
        }
      }

      const result = transformWeatherData(mockData)
      expect(result.temperature).toBe(23)
      expect(result.condition).toBe('Clear sky')
      expect(result.humidity).toBe(65)
      expect(result.windSpeed).toBe(12)
      expect(result.icon).toBe('☀️')
    })
  })

  describe('getWeatherBackground', () => {
    it('should return dark orange for hot and sunny weather', () => {
      const weatherData: WeatherData = {
        temperature: 35,
        condition: 'Clear sky',
        humidity: 40,
        windSpeed: 5,
        icon: '☀️'
      }
      
      const result = getWeatherBackground(weatherData)
      expect(result).toBe('bg-gradient-to-br from-orange-500 to-red-600')
    })

    it('should return yellow-orange for warm and sunny weather', () => {
      const weatherData: WeatherData = {
        temperature: 25,
        condition: 'Clear sky',
        humidity: 50,
        windSpeed: 8,
        icon: '☀️'
      }
      
      const result = getWeatherBackground(weatherData)
      expect(result).toBe('bg-gradient-to-br from-yellow-400 to-orange-400')
    })
  })

  describe('getWeatherTextColor', () => {
    it('should return white text for hot weather', () => {
      const weatherData: WeatherData = {
        temperature: 35,
        condition: 'Clear sky',
        humidity: 40,
        windSpeed: 5,
        icon: '☀️'
      }
      
      const result = getWeatherTextColor(weatherData)
      expect(result).toBe('text-white')
    })
  })
})
