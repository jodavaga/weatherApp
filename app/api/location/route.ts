import { NextResponse } from 'next/server';

interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface IpApiResponse {
  status: string;
  message?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  lat?: string | number;
  lon?: string | number;
  timezone?: string;
  query?: string;
}

// Fallback location data
const FALLBACK_LOCATION_MOCK: LocationData = {
  city: 'New York',
  region: 'NY',
  country: 'US',
  latitude: 40.7128,
  longitude: -74.0060,
  timezone: 'America/New_York',
};

const transformIpApiResponse = (data: IpApiResponse): LocationData => {
  return {
    city: data.city || 'Unknown City',
    region: data.regionName || data.region || 'Unknown Region',
    country: data.countryCode || data.country || 'Unknown',
    latitude: parseFloat(String(data.lat || 0)) || 0,
    longitude: parseFloat(String(data.lon || 0)) || 0,
    timezone: data.timezone || 'UTC',
  };
};

const fetchLocationFromIpApi = async (): Promise<LocationData> => {
  try {
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,query');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: IpApiResponse = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'IP API request failed');
    }
    
    console.log('IP API response:', data);
    return transformIpApiResponse(data);
  } catch (error) {
    console.warn('IP API failed:', error);
    throw error;
  }
};

export async function GET() {
  try {
    const location = await fetchLocationFromIpApi();
    
    return NextResponse.json(location);
  } catch (error) {
    console.warn('IP Api geolocation failed, using mock location:', error);
    return NextResponse.json(FALLBACK_LOCATION_MOCK);
  }
}
