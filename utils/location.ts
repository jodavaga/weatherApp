export interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const fetchLocationData = async (): Promise<LocationData> => {
  try {
    const response = await fetch('/api/location');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const location = await response.json();
    return location;
  } catch (error) {
    console.error('Client: Failed to fetch location data:', error);
    throw error;
  }
};
