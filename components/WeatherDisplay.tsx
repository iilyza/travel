import { useEffect, useState } from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherByCity, getWeatherForecast } from '@/lib/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherDisplayProps {
  city: string;
}

export function WeatherDisplay({ city }: WeatherDisplayProps) {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const [current, forecastData] = await Promise.all([
          getWeatherByCity(city),
          getWeatherForecast(city),
        ]);
        setCurrentWeather(current);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentWeather) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather in {city}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
              alt={currentWeather.description}
              className="w-16 h-16"
            />
            <div>
              <p className="text-2xl font-bold">{Math.round(currentWeather.temperature)}°C</p>
              <p className="capitalize">{currentWeather.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p>{currentWeather.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Wind Speed</p>
              <p>{currentWeather.windSpeed} m/s</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 