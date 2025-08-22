import { fetchLocationData, type LocationData } from '../location'

describe('Location Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchLocationData', () => {
    it('should fetch location data successfully', async () => {
      const mockLocationData: LocationData = {
        city: 'New York',
        region: 'NY',
        country: 'US',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocationData
      })

      const result = await fetchLocationData()

      expect(global.fetch).toHaveBeenCalledWith('/api/location')
      expect(result).toEqual(mockLocationData)
    })

    it('should throw error when API call fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchLocationData()).rejects.toThrow('HTTP error! status: 500')
    })

  })
})
