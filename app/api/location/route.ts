import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This API is now a fallback for client-side geolocation
    // Return a default location for cases where client-side geolocation fails
    return NextResponse.json({
      city: 'New York',
      region: 'NY',
      country: 'US',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
    });
  } catch (error) {
    console.error('Error getting location:', error);
    return NextResponse.json(
      { error: 'Failed to get location data' },
      { status: 500 }
    );
  }
}
