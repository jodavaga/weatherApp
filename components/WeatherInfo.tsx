'use client';
import { useState, useEffect } from 'react';
import { fetchWeatherData, transformWeatherData, WeatherData } from '../utils/weather';
import { fetchLocationData, LocationData } from '../utils/location';
import { useWeather } from './WeatherContext';

export default function WeatherInfo() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setWeatherData } = useWeather();

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching location...');
        const locationData = await fetchLocationData();
        setLocation(locationData);

        const weatherData = await fetchWeatherData(
          locationData.latitude,
          locationData.longitude,
          locationData.timezone
        );
        
        const transformedWeather = transformWeatherData(weatherData);
        setWeather(transformedWeather);
        setWeatherData(transformedWeather); // Share weather data with context
      } catch (err) {
        console.error('weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, [setWeatherData]);

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
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-600 dark:text-blue-400">📍</span>
            <p className="text-sm text-black/70 dark:text-white/70">
              {location.city}, {location.region}, {location.country}
            </p>
          </div>
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
            <p>Timezone: {location.timezone}</p>
          </div>
        </div>
      )}
    </div>
  );
}


