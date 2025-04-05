import { WeatherData } from '@/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';

function getWeatherIcon(weatherCode: number): string {
  // Weather codes from Open-Meteo
  // https://open-meteo.com/en/docs
  if (weatherCode === 0) return '01d'; // Clear sky
  if (weatherCode <= 3) return '02d'; // Partly cloudy
  if (weatherCode <= 48) return '50d'; // Fog
  if (weatherCode <= 67) return '10d'; // Rain
  if (weatherCode <= 77) return '13d'; // Snow
  if (weatherCode <= 99) return '11d'; // Thunderstorm
  return '01d';
}

function getWeatherDescription(weatherCode: number): string {
  if (weatherCode === 0) return 'Clear sky';
  if (weatherCode <= 3) return 'Partly cloudy';
  if (weatherCode <= 48) return 'Fog';
  if (weatherCode <= 67) return 'Rain';
  if (weatherCode <= 77) return 'Snow';
  if (weatherCode <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  try {
    // First, get the coordinates for the city
    const geocodingResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    
    if (!geocodingResponse.ok) {
      throw new Error(`Failed to fetch location data: ${geocodingResponse.statusText}`);
    }
    
    const geocodingData = await geocodingResponse.json();
    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error(`Location "${city}" not found. Please check the spelling or try a nearby city.`);
    }
    
    const { latitude, longitude } = geocodingData.results[0];
    
    // Then, get the current weather
    const weatherResponse = await fetch(
      `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation,cloud_cover`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Failed to fetch weather data: ${weatherResponse.statusText}`);
    }
    
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    
    return {
      temperature: current.temperature_2m,
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      precipitation: current.precipitation,
      cloudCover: current.cloud_cover,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

export async function getWeatherForecast(city: string): Promise<WeatherData[]> {
  try {
    // First, get the coordinates for the city
    const geocodingResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    
    if (!geocodingResponse.ok) {
      throw new Error(`Failed to fetch location data: ${geocodingResponse.statusText}`);
    }
    
    const geocodingData = await geocodingResponse.json();
    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error(`Location "${city}" not found. Please check the spelling or try a nearby city.`);
    }
    
    const { latitude, longitude } = geocodingData.results[0];
    
    // Then, get the forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Failed to fetch weather forecast: ${forecastResponse.statusText}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    return forecastData.daily.time.map((date: string, index: number) => ({
      temperature: (forecastData.daily.temperature_2m_max[index] + forecastData.daily.temperature_2m_min[index]) / 2,
      description: getWeatherDescription(forecastData.daily.weather_code[index]),
      icon: getWeatherIcon(forecastData.daily.weather_code[index]),
      humidity: 0, // Not available in daily forecast
      windSpeed: forecastData.daily.wind_speed_10m_max[index],
      precipitation: forecastData.daily.precipitation_sum[index],
      date: new Date(date),
    }));
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
} 