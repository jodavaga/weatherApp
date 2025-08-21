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

// Fetch weather data from Open-Meteo
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
