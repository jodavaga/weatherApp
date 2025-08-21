import { NextRequest, NextResponse } from 'next/server';

interface GeoData {
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

interface RequestWithGeo extends NextRequest {
  geo?: GeoData;
}

export async function GET(request: NextRequest) {
  try {
    const geo = (request as RequestWithGeo).geo;
    
    if (!geo) {
      return NextResponse.json(
        { error: 'Location data not available' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      city: geo.city || 'Unknown',
      region: geo.region || 'Unknown',
      country: geo.country || 'Unknown',
      latitude: geo.latitude || 0,
      longitude: geo.longitude || 0,
      timezone: geo.timezone || 'UTC',
    });
  } catch (error) {
    console.error('Error getting location:', error);
    return NextResponse.json(
      { error: 'Failed to get location data' },
      { status: 500 }
    );
  }
}
