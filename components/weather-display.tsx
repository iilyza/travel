import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, AlertTriangle, Droplets, Wind, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getWeatherByCity, getWeatherForecast } from "@/lib/weather"
import { WeatherData } from "@/types/weather"

interface WeatherDisplayProps {
  locations: string[]
}

interface LocationWeather {
  location: string
  current: WeatherData | null
  forecast: WeatherData[]
  error?: string
}

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

function getWeatherBackground(weatherCode: number): string {
  if (weatherCode === 0) return 'bg-gradient-to-br from-blue-400 to-blue-600'; // Clear sky
  if (weatherCode <= 3) return 'bg-gradient-to-br from-blue-300 to-blue-500'; // Partly cloudy
  if (weatherCode <= 48) return 'bg-gradient-to-br from-gray-300 to-gray-500'; // Fog
  if (weatherCode <= 67) return 'bg-gradient-to-br from-gray-400 to-gray-600'; // Rain
  if (weatherCode <= 77) return 'bg-gradient-to-br from-blue-100 to-blue-300'; // Snow
  if (weatherCode <= 99) return 'bg-gradient-to-br from-gray-600 to-gray-800'; // Thunderstorm
  return 'bg-gradient-to-br from-blue-400 to-blue-600';
}

function getWeatherPattern(weatherCode: number): string {
  if (weatherCode === 0) return 'sunny-pattern'; // Clear sky
  if (weatherCode <= 3) return 'cloudy-pattern'; // Partly cloudy
  if (weatherCode <= 48) return 'fog-pattern'; // Fog
  if (weatherCode <= 67) return 'rain-pattern'; // Rain
  if (weatherCode <= 77) return 'snow-pattern'; // Snow
  if (weatherCode <= 99) return 'thunder-pattern'; // Thunderstorm
  return 'sunny-pattern';
}

export function WeatherDisplay({ locations }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<LocationWeather[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationWeather | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      if (locations.length === 0) return

      try {
        setLoading(true)
        const weatherPromises = locations.map(async (location) => {
          try {
            const [current, forecast] = await Promise.all([
              getWeatherByCity(location),
              getWeatherForecast(location)
            ])
            return { location, current, forecast }
          } catch (err) {
            console.error(`Error fetching weather for ${location}:`, err)
            return { 
              location, 
              current: null, 
              forecast: [],
              error: err instanceof Error ? err.message : 'Failed to fetch weather data'
            }
          }
        })

        const results = await Promise.all(weatherPromises)
        setWeatherData(results)
        setError(null)
      } catch (err) {
        setError("Failed to fetch weather data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [locations])

  const handleLocationClick = (locationData: LocationWeather) => {
    setSelectedLocation(locationData)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {locations.map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {weatherData.map((locationData) => {
        if (!locationData.current) {
          return (
            <Card key={locationData.location}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <div>
                      <h3 className="font-medium">{locationData.location}</h3>
                      <p className="text-sm text-gray-500">
                        {locationData.error || "Weather data not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        }

        const weatherCode = locationData.current.icon === '01d' ? 0 : 
                          locationData.current.icon === '02d' ? 1 :
                          locationData.current.icon === '50d' ? 45 :
                          locationData.current.icon === '10d' ? 61 :
                          locationData.current.icon === '13d' ? 71 :
                          locationData.current.icon === '11d' ? 95 : 0;

        return (
          <Card 
            key={locationData.location}
            className={cn(
              "cursor-pointer transition-colors hover:bg-gray-50",
              "relative overflow-hidden"
            )}
            onClick={() => handleLocationClick(locationData)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${locationData.current.icon}@2x.png`}
                    alt={locationData.current.description}
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="font-medium">{locationData.location}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {locationData.current.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    {Math.round(locationData.current.temperature)}°C
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Weather Forecast for {selectedLocation?.location}</DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <div className="space-y-6">
              {/* Current Weather */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${selectedLocation.current?.icon}@2x.png`}
                    alt={selectedLocation.current?.description}
                    className="w-16 h-16"
                  />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(selectedLocation.current?.temperature || 0)}°C
                    </p>
                    <p className="capitalize">
                      {selectedLocation.current?.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p>{selectedLocation.current?.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p>{selectedLocation.current?.windSpeed} m/s</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Clouds</p>
                      <p>{selectedLocation.current?.cloudCover}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">5-Day Forecast</h3>
                <div className="grid grid-cols-5 gap-2">
                  {selectedLocation.forecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1">
                      <p className="text-sm">{format(day.date!, 'EEE')}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.description}
                        className="w-8 h-8"
                      />
                      <p className="text-sm font-medium">{Math.round(day.temperature)}°C</p>
                      {day.precipitation && day.precipitation > 0 && (
                        <p className="text-xs text-gray-500">{day.precipitation} mm</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

