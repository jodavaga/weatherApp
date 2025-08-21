'use client';

import { useState, useEffect } from 'react';
interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

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

        // Get location data from API
        const locationResponse = await fetch('/api/location');
        if (!locationResponse.ok) {
          throw new Error('Failed to get location data');
        }
        const locationData: LocationData = await locationResponse.json();
        setLocation(locationData);

        // Fetch weather data from Open-Meteo
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locationData.latitude}&longitude=${locationData.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=${locationData.timezone}`
        );

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Map weather codes to conditions and icons
        const weatherCode = current.weather_code;
        let condition = 'Unknown';
        let icon = '❓';

        if (weatherCode === 0) {
          condition = 'Clear sky';
          icon = '☀️';
        } else if (weatherCode >= 1 && weatherCode <= 3) {
          condition = 'Partly cloudy';
          icon = '⛅';
        } else if (weatherCode >= 45 && weatherCode <= 48) {
          condition = 'Foggy';
          icon = '🌫️';
        } else if (weatherCode >= 51 && weatherCode <= 55) {
          condition = 'Drizzle';
          icon = '🌦️';
        } else if (weatherCode >= 56 && weatherCode <= 57) {
          condition = 'Freezing drizzle';
          icon = '🌨️';
        } else if (weatherCode >= 61 && weatherCode <= 65) {
          condition = 'Rain';
          icon = '🌧️';
        } else if (weatherCode >= 66 && weatherCode <= 67) {
          condition = 'Freezing rain';
          icon = '🌨️';
        } else if (weatherCode >= 71 && weatherCode <= 75) {
          condition = 'Snow';
          icon = '❄️';
        } else if (weatherCode >= 77 && weatherCode <= 77) {
          condition = 'Snow grains';
          icon = '❄️';
        } else if (weatherCode >= 80 && weatherCode <= 82) {
          condition = 'Rain showers';
          icon = '🌦️';
        } else if (weatherCode >= 85 && weatherCode <= 86) {
          condition = 'Snow showers';
          icon = '🌨️';
        } else if (weatherCode >= 95 && weatherCode <= 95) {
          condition = 'Thunderstorm';
          icon = '⛈️';
        } else if (weatherCode >= 96 && weatherCode <= 99) {
          condition = 'Thunderstorm with hail';
          icon = '⛈️';
        }

        const weather: WeatherData = {
          temperature: Math.round(current.temperature_2m),
          condition,
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          icon,
        };

        setWeather(weather);
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


