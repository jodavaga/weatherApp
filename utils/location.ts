export interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const fetchLocationData = async (): Promise<LocationData> => {
  const response = await fetch('/api/location');
  if (!response.ok) {
    throw new Error('Failed to get location data');
  }
  return response.json();
};
