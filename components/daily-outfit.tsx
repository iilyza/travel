import { useState } from "react"
import { cn } from "@/lib/utils"
import { WeatherData } from "@/types/weather"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DailyOutfitProps {
  weather: WeatherData | null
  gender?: "male" | "female"
}

const OUTFIT_SUGGESTIONS = {
  hot: {
    male: [
      "Light t-shirt",
      "Shorts",
      "Sandals",
      "Sunglasses",
      "Baseball cap"
    ],
    female: [
      "Light blouse",
      "Shorts or skirt",
      "Sandals",
      "Sunglasses",
      "Sun hat"
    ]
  },
  warm: {
    male: [
      "T-shirt",
      "Light pants",
      "Sneakers",
      "Light jacket"
    ],
    female: [
      "Blouse",
      "Light pants or skirt",
      "Sneakers",
      "Light cardigan"
    ]
  },
  mild: {
    male: [
      "Long-sleeve shirt",
      "Jeans",
      "Sneakers",
      "Light jacket"
    ],
    female: [
      "Long-sleeve top",
      "Jeans or pants",
      "Sneakers",
      "Light jacket"
    ]
  },
  cool: {
    male: [
      "Sweater",
      "Jeans",
      "Boots",
      "Jacket"
    ],
    female: [
      "Sweater",
      "Jeans or pants",
      "Boots",
      "Jacket"
    ]
  },
  cold: {
    male: [
      "Thermal shirt",
      "Jeans",
      "Winter boots",
      "Winter jacket",
      "Gloves",
      "Beanie"
    ],
    female: [
      "Thermal top",
      "Jeans or pants",
      "Winter boots",
      "Winter jacket",
      "Gloves",
      "Beanie"
    ]
  }
}

const RAIN_ACCESSORIES = {
  male: [
    "Waterproof jacket",
    "Umbrella",
    "Waterproof shoes"
  ],
  female: [
    "Waterproof jacket",
    "Umbrella",
    "Waterproof shoes"
  ]
}

export function DailyOutfit({ weather, gender = "male" }: DailyOutfitProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Outfit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No weather data available</p>
        </CardContent>
      </Card>
    )
  }

  const temperature = weather.temperature
  const isRaining = weather.description.toLowerCase().includes("rain")

  let temperatureCategory: keyof typeof OUTFIT_SUGGESTIONS
  if (temperature >= 30) temperatureCategory = "hot"
  else if (temperature >= 20) temperatureCategory = "warm"
  else if (temperature >= 15) temperatureCategory = "mild"
  else if (temperature >= 10) temperatureCategory = "cool"
  else temperatureCategory = "cold"

  const baseOutfit = OUTFIT_SUGGESTIONS[temperatureCategory][gender]
  const rainAccessories = isRaining ? RAIN_ACCESSORIES[gender] : []

  const handleItemClick = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Outfit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {baseOutfit.map((item) => (
              <Badge
                key={item}
                variant={selectedItems.includes(item) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {item}
              </Badge>
            ))}
            {rainAccessories.map((item) => (
              <Badge
                key={item}
                variant={selectedItems.includes(item) ? "default" : "outline"}
                className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                onClick={() => handleItemClick(item)}
              >
                {item}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <p>Temperature: {Math.round(temperature)}°C</p>
            <p>Conditions: {weather.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 