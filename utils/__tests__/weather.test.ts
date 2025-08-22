import { 
  getWeatherCondition, 
  fetchWeatherData, 
  transformWeatherData,
  type OpenMeteoResponse,
} from '../weather'

describe('Weather Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWeatherCondition', () => {
    it('should return correct condition and icon for clear sky', () => {
      const result = getWeatherCondition(0)
      expect(result).toEqual({
        condition: 'Clear sky',
        icon: '☀️'
      })
    })

    it('should return correct condition and icon for rain', () => {
      const result = getWeatherCondition(61)
      expect(result).toEqual({
        condition: 'Rain',
        icon: '🌧️'
      })
    })

    it('should handle all weather codes', () => {
      const testCases = [
        { code: 1, expected: { condition: 'Partly cloudy', icon: '⛅' } },
        { code: 45, expected: { condition: 'Foggy', icon: '🌫️' } },
        { code: 51, expected: { condition: 'Drizzle', icon: '🌦️' } },
        { code: 80, expected: { condition: 'Rain showers', icon: '🌦️' } },
        { code: 85, expected: { condition: 'Snow showers', icon: '🌨️' } },
        { code: 96, expected: { condition: 'Thunderstorm with hail', icon: '⛈️' } },
      ]

      testCases.forEach(({ code, expected }) => {
        const result = getWeatherCondition(code)
        expect(result).toEqual(expected)
      })
    })
  })

  describe('fetchWeatherData', () => {
    it('should fetch weather data successfully', async () => {
      const mockResponse: OpenMeteoResponse = {
        current: {
          temperature_2m: 22.5,
          relative_humidity_2m: 65,
          wind_speed_10m: 12.3,
          weather_code: 1
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchWeatherData(40.7128, -74.0060, 'America/New_York')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=America/New_York'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when API call fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchWeatherData(40.7128, -74.0060, 'America/New_York'))
        .rejects.toThrow('Failed to fetch weather data')
    })
  })

  describe('transformWeatherData', () => {
    it('should transform weather data correctly', () => {
      const mockWeatherData: OpenMeteoResponse = {
        current: {
          temperature_2m: 22.5,
          relative_humidity_2m: 65,
          wind_speed_10m: 12.3,
          weather_code: 1
        }
      }

      const result = transformWeatherData(mockWeatherData)

      expect(result).toEqual({
        temperature: 23, 
        condition: 'Partly cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '⛅'
      })
    })
  })
})
