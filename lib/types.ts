export interface PackingItem {
  name: string
  quantity: number
  packed: boolean
  purpose?: string
  isLiquid?: boolean
  volume?: string
}

export interface WeatherData {
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  date?: Date
}

