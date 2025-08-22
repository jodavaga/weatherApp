export interface WeatherCondition {
  condition: string;
  icon: string;
}
export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const getWeatherCondition = (weatherCode: number): WeatherCondition => {
  const weatherMap: Record<number, WeatherCondition> = {
    0: { condition: 'Clear sky', icon: '☀️' },
    1: { condition: 'Partly cloudy', icon: '⛅' },
    2: { condition: 'Partly cloudy', icon: '⛅' },
    3: { condition: 'Partly cloudy', icon: '⛅' },
    45: { condition: 'Foggy', icon: '🌫️' },
    48: { condition: 'Foggy', icon: '🌫️' },
    51: { condition: 'Drizzle', icon: '🌦️' },
    53: { condition: 'Drizzle', icon: '🌦️' },
    55: { condition: 'Drizzle', icon: '🌦️' },
    56: { condition: 'Freezing drizzle', icon: '🌨️' },
    57: { condition: 'Freezing drizzle', icon: '🌨️' },
    61: { condition: 'Rain', icon: '🌧️' },
    63: { condition: 'Rain', icon: '🌧️' },
    65: { condition: 'Rain', icon: '🌧️' },
    66: { condition: 'Freezing rain', icon: '🌨️' },
    67: { condition: 'Freezing rain', icon: '🌨️' },
    71: { condition: 'Snow', icon: '❄️' },
    73: { condition: 'Snow', icon: '❄️' },
    75: { condition: 'Snow', icon: '❄️' },
    77: { condition: 'Snow grains', icon: '❄️' },
    80: { condition: 'Rain showers', icon: '🌦️' },
    81: { condition: 'Rain showers', icon: '🌦️' },
    82: { condition: 'Rain showers', icon: '🌦️' },
    85: { condition: 'Snow showers', icon: '🌨️' },
    86: { condition: 'Snow showers', icon: '🌨️' },
    95: { condition: 'Thunderstorm', icon: '⛈️' },
    96: { condition: 'Thunderstorm with hail', icon: '⛈️' },
    99: { condition: 'Thunderstorm with hail', icon: '⛈️' },
  };

  return weatherMap[weatherCode] || { condition: 'Unknown', icon: '❓' };
};

export const fetchWeatherData = async (
  latitude: number, 
  longitude: number, 
  timezone: string
): Promise<OpenMeteoResponse> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=${timezone}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  return response.json();
};

export const transformWeatherData = (weatherData: OpenMeteoResponse): WeatherData => {
  const current = weatherData.current;
  const { condition, icon } = getWeatherCondition(current.weather_code);
  
  return {
    temperature: Math.round(current.temperature_2m),
    condition,
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    icon,
  };
};

export const getWeatherBackground = (weatherData: WeatherData): string => {
  const { temperature, condition } = weatherData;
  
  // Temperature-based colors
  if (temperature >= 30) {
    // Hot weather - warm colors
    if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
      return 'bg-gradient-to-br from-orange-500 to-red-600'; // Dark orange for hot and sunny
    }
    return 'bg-gradient-to-br from-orange-400 to-red-500'; // Orange for hot weather
  } else if (temperature >= 20) {
    // Warm weather
    if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
      return 'bg-gradient-to-br from-yellow-400 to-orange-400'; // Yellow-orange for warm and sunny
    }
    return 'bg-gradient-to-br from-blue-300 to-blue-400'; // Light blue for warm weather
  } else if (temperature >= 10) {
    // Cool weather
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
      return 'bg-gradient-to-br from-gray-400 to-gray-500'; // Gray for rainy weather
    }
    return 'bg-gradient-to-br from-blue-200 to-blue-300'; // Light blue for cool weather
  } else if (temperature >= 0) {
    // Cold weather
    if (condition.toLowerCase().includes('snow')) {
      return 'bg-gradient-to-br from-blue-100 to-blue-200'; // Very light blue for snowy weather
    }
    return 'bg-gradient-to-br from-blue-100 to-gray-200'; // Light blue-gray for cold weather
  } else {
    // Very cold weather
    if (condition.toLowerCase().includes('snow')) {
      return 'bg-gradient-to-br from-blue-50 to-blue-100'; // Very light blue for snowy weather
    }
    return 'bg-gradient-to-br from-gray-100 to-blue-100'; // Light gray-blue for very cold weather
  }
};

export const getWeatherTextColor = (weatherData: WeatherData): string => {
  const { temperature, condition } = weatherData;
  
  // Dark text for light backgrounds, light text for dark backgrounds
  if (temperature >= 30) {
    return 'text-white'; // White text for hot weather backgrounds
  } else if (temperature >= 20) {
    if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
      return 'text-gray-800'; // Dark text for yellow backgrounds
    }
    return 'text-gray-800'; // Dark text for light blue backgrounds
  } else {
    return 'text-gray-800'; // Dark text for light backgrounds
  }
};
