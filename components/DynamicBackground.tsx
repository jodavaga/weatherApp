'use client';

import { useWeather } from './WeatherContext';
import { getWeatherBackground, getWeatherTextColor } from '../utils/weather';

interface DynamicBackgroundProps {
  children: React.ReactNode;
}

export default function DynamicBackground({ children }: DynamicBackgroundProps) {
  const { weatherData } = useWeather();

  // Default background when no weather data is available
  const defaultBackground = 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const defaultTextColor = 'text-gray-800';

  // Get background and text color based on weather
  const backgroundClass = weatherData 
    ? getWeatherBackground(weatherData) 
    : defaultBackground;
  
  const textColorClass = weatherData 
    ? getWeatherTextColor(weatherData) 
    : defaultTextColor;

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${backgroundClass} ${textColorClass}`}>
      {children}
    </div>
  );
}
