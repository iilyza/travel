export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date?: Date;
  precipitation?: number;
  cloudCover?: number;
} 