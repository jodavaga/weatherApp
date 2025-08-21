'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherData, transformWeatherData, WeatherData } from '../utils/weather';
import { fetchLocationData, LocationData } from '../utils/location';

export default function WeatherInfo() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch location data
        const locationData = await fetchLocationData();
        setLocation(locationData);

        // Fetch and transform weather data
        const weatherData = await fetchWeatherData(
          locationData.latitude,
          locationData.longitude,
          locationData.timezone
        );
        
        const transformedWeather = transformWeatherData(weatherData);
        setWeather(transformedWeather);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Weather</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Weather</h2>
        <div className="text-red-600 dark:text-red-400 text-sm">
          <p>Unable to load weather data</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Weather</h2>
      {location && weather && (
        <div className="space-y-2">
          <p className="text-sm text-black/70 dark:text-white/70">
            {location.city}, {location.country}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{weather.icon}</span>
            <div className="text-2xl font-bold">
              {weather.temperature}°C
            </div>
          </div>
          <p className="text-sm">{weather.condition}</p>
          <div className="text-xs text-black/60 dark:text-white/60 space-y-1">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.windSpeed} km/h</p>
          </div>
        </div>
      )}
    </div>
  );
}


