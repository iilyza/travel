"use client"

import { useState } from "react"
import { format, addDays, parseISO } from "date-fns"
import { Cloud, CloudRain, Sun, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WeatherData } from "@/types/weather"

interface OutfitGuideProps {
  duration: number
  startDate: string
  weather?: WeatherData
  tripPurposes: string[]
  itinerary?: string
  destination: string
  gender?: "male" | "female" | "neutral"
}

interface DailyOutfit {
  day: number
  date: Date
  daytime: {
    top: string
    bottom: string
    shoes: string
    accessories: string[]
    outerwear?: string
  }
  evening?: {
    top: string
    bottom: string
    shoes: string
    accessories: string[]
    outerwear?: string
  }
  activities: string[]
  weatherConditions?: WeatherData
}

export function OutfitGuide({
  duration,
  startDate,
  weather,
  tripPurposes,
  itinerary,
  destination,
  gender = "neutral",
}: OutfitGuideProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3

  // Parse itinerary to extract activities for each day
  const parseItinerary = (itineraryText: string) => {
    if (!itineraryText) return {}

    const activities: Record<number, string[]> = {}
    const lines = itineraryText.split("\n")

    for (const line of lines) {
      // Try to match patterns like "Day 1:" or "Day 1 -" or just "Day 1"
      const dayMatch = line.match(/day\s*(\d+)[:-]?\s*(.*)/i)
      if (dayMatch) {
        const day = Number.parseInt(dayMatch[1])
        const activity = dayMatch[2].trim()

        if (!activities[day]) {
          activities[day] = []
        }

        if (activity) {
          activities[day].push(activity)
        }
      } else if (Object.keys(activities).length > 0) {
        // If we've already found at least one day, and this line doesn't start with "Day X",
        // add it to the last day's activities
        const lastDay = Math.max(...Object.keys(activities).map(Number))
        const trimmedLine = line.trim()
        if (trimmedLine) {
          activities[lastDay].push(trimmedLine)
        }
      }
    }

    return activities
  }

  const parsedActivities = parseItinerary(itinerary || "")

  // Parse locations from destination
  const locations = destination
    .split(",")
    .map((loc) => loc.trim())
    .filter(Boolean)

  // Generate daily outfits based on weather, trip purposes, and itinerary
  const generateDailyOutfits = (): DailyOutfit[] => {
    const outfits: DailyOutfit[] = []
    const startDateObj = startDate ? parseISO(startDate) : new Date()

    // Determine if we need formal outfits
    const needsFormal = tripPurposes.includes("business")

    // Determine if we need beach/swim outfits
    const needsBeach = tripPurposes.includes("beach")

    // Determine if we need outdoor/hiking outfits
    const needsOutdoor = tripPurposes.includes("outdoor")

    // Weather variations - in a real app, we would have different weather for each day and location
    // For now, we'll create some variations based on the current weather
    const weatherVariations = weather
      ? [
          { ...weather },
          {
            ...weather,
            temperature: Math.min(weather.temperature + 2, 35),
          },
          {
            ...weather,
            temperature: Math.max(weather.temperature - 2, 0),
            description: weather.description.toLowerCase().includes("rain")
              ? weather.description
              : "rainy",
          },
          {
            ...weather,
            description: "rainy",
          },
        ]
      : []

    for (let day = 1; day <= duration; day++) {
      // Get activities for this day from the itinerary, or use default activities
      const dayActivities = parsedActivities[day] || []

      // Determine if this day has special activities
      const hasBeachActivity =
        dayActivities.some(
          (activity) =>
            activity.toLowerCase().includes("beach") ||
            activity.toLowerCase().includes("swim") ||
            activity.toLowerCase().includes("ocean") ||
            activity.toLowerCase().includes("sea"),
        ) ||
        (needsBeach && day % 2 === 0)

      const hasBusinessActivity =
        dayActivities.some(
          (activity) =>
            activity.toLowerCase().includes("meeting") ||
            activity.toLowerCase().includes("conference") ||
            activity.toLowerCase().includes("business") ||
            activity.toLowerCase().includes("presentation"),
        ) ||
        (needsFormal && day % 3 === 0)

      const hasOutdoorActivity =
        dayActivities.some(
          (activity) =>
            activity.toLowerCase().includes("hike") ||
            activity.toLowerCase().includes("trek") ||
            activity.toLowerCase().includes("outdoor") ||
            activity.toLowerCase().includes("mountain") ||
            activity.toLowerCase().includes("trail"),
        ) ||
        (needsOutdoor && day % 2 === 1)

      // Get weather for this day - in a real app, we would have actual forecasts
      // For now, we'll cycle through our variations
      const dayWeather = weatherVariations[day % weatherVariations.length]

      // Generate outfit based on activities, weather, and gender
      const outfit: DailyOutfit = {
        day,
        date: addDays(startDateObj, day - 1),
        activities: dayActivities.length > 0 ? dayActivities : ["Free day / Exploration"],
        weatherConditions: dayWeather,
        daytime: {
          top: "",
          bottom: "",
          shoes: "",
          accessories: [],
        },
      }

      // Daytime outfit with gender considerations
      if (hasBeachActivity) {
        if (gender === "female") {
          outfit.daytime = {
            top: dayWeather?.temperature && dayWeather.temperature > 25 ? "Light tank top or t-shirt" : "T-shirt",
            bottom: "Swimsuit with shorts/skirt/cover-up",
            shoes: "Sandals or flip-flops",
            accessories: ["Sunglasses", "Sun hat", "Beach bag", "Sunscreen", "Hair tie"],
          }
        } else if (gender === "male") {
          outfit.daytime = {
            top: dayWeather?.temperature && dayWeather.temperature > 25 ? "Light t-shirt or tank top" : "T-shirt",
            bottom: "Swim shorts",
            shoes: "Sandals or flip-flops",
            accessories: ["Sunglasses", "Sun hat", "Beach bag", "Sunscreen"],
          }
        } else {
          outfit.daytime = {
            top: dayWeather?.temperature && dayWeather.temperature > 25 ? "Light t-shirt or tank top" : "T-shirt",
            bottom: "Swimwear with shorts/cover-up",
            shoes: "Sandals or flip-flops",
            accessories: ["Sunglasses", "Sun hat", "Beach bag", "Sunscreen"],
          }
        }
      } else if (hasBusinessActivity) {
        if (gender === "female") {
          outfit.daytime = {
            top: "Blouse or business shirt",
            bottom: "Skirt, dress, or formal pants",
            shoes: "Formal shoes or heels",
            accessories: ["Watch", "Professional bag/briefcase", "Minimal jewelry"],
          }
        } else if (gender === "male") {
          outfit.daytime = {
            top: "Business shirt",
            bottom: "Formal pants",
            shoes: "Formal shoes",
            accessories: ["Watch", "Professional bag/briefcase", "Tie"],
          }
        } else {
          outfit.daytime = {
            top: "Business shirt or blouse",
            bottom: "Formal pants or skirt",
            shoes: "Formal shoes",
            accessories: ["Watch", "Professional bag/briefcase"],
          }
        }

        if (dayWeather?.temperature && dayWeather.temperature < 15) {
          outfit.daytime.outerwear = "Blazer or suit jacket"
        }
      } else if (hasOutdoorActivity) {
        if (gender === "female") {
          outfit.daytime = {
            top: "Quick-dry shirt or hiking top",
            bottom: "Hiking pants or shorts",
            shoes: "Hiking boots or trail shoes",
            accessories: ["Hat", "Sunglasses", "Daypack", "Water bottle", "Hair tie/bandana"],
          }
        } else if (gender === "male") {
          outfit.daytime = {
            top: "Quick-dry shirt or hiking top",
            bottom: "Hiking pants or shorts",
            shoes: "Hiking boots or trail shoes",
            accessories: ["Hat", "Sunglasses", "Daypack", "Water bottle"],
          }
        } else {
          outfit.daytime = {
            top: "Quick-dry shirt or hiking top",
            bottom: "Hiking pants or shorts",
            shoes: "Hiking boots or trail shoes",
            accessories: ["Hat", "Sunglasses", "Daypack", "Water bottle"],
          }
        }

        if (dayWeather?.description?.toLowerCase().includes("rain")) {
          outfit.daytime.outerwear = "Waterproof jacket"
        } else if (dayWeather?.temperature && dayWeather.temperature < 15) {
          outfit.daytime.outerwear = "Light jacket or fleece"
        }
      } else {
        // Casual outfit
        if (gender === "female") {
          outfit.daytime = {
            top: dayWeather?.temperature && dayWeather.temperature > 25 ? "Light t-shirt or tank top" : "T-shirt",
            bottom: dayWeather?.temperature && dayWeather.temperature > 25 ? "Shorts or skirt" : "Jeans or pants",
            shoes: "Comfortable walking shoes",
            accessories: ["Sunglasses", "Small bag"],
          }
        } else if (gender === "male") {
          outfit.daytime = {
            top: dayWeather?.temperature && dayWeather.temperature > 25 ? "Light t-shirt" : "T-shirt",
            bottom: dayWeather?.temperature && dayWeather.temperature > 25 ? "Shorts" : "Jeans or pants",
            shoes: "Comfortable walking shoes",
            accessories: ["Sunglasses", "Small bag"],
          }
        } else {
          outfit.daytime = {
            top: dayWeather?.temperature && dayWeather.temperature > 25 ? "Light t-shirt" : "T-shirt",
            bottom: dayWeather?.temperature && dayWeather.temperature > 25 ? "Shorts" : "Jeans or pants",
            shoes: "Comfortable walking shoes",
            accessories: ["Sunglasses", "Small bag"],
          }
        }

        if (dayWeather?.description?.toLowerCase().includes("rain")) {
          outfit.daytime.outerwear = "Rain jacket or umbrella"
        } else if (dayWeather?.temperature && dayWeather.temperature < 15) {
          outfit.daytime.outerwear = "Light jacket or sweater"
        }
      }

      // Evening outfit
      if (gender === "female") {
        outfit.evening = {
          top: "Nice blouse or dressy top",
          bottom: "Dress pants or skirt",
          shoes: "Dress shoes or heels",
          accessories: ["Evening bag", "Jewelry"],
        }
      } else if (gender === "male") {
        outfit.evening = {
          top: "Dress shirt",
          bottom: "Dress pants",
          shoes: "Dress shoes",
          accessories: ["Watch"],
        }
      } else {
        outfit.evening = {
          top: "Dress shirt or blouse",
          bottom: "Dress pants or skirt",
          shoes: "Dress shoes",
          accessories: ["Watch", "Evening bag"],
        }
      }

      if (dayWeather?.description?.toLowerCase().includes("rain")) {
        outfit.evening.outerwear = "Rain jacket or umbrella"
      } else if (dayWeather?.temperature && dayWeather.temperature < 15) {
        outfit.evening.outerwear = "Light jacket or sweater"
      }

      outfits.push(outfit)
    }

    return outfits
  }

  const dailyOutfits = generateDailyOutfits()
  const totalPages = Math.ceil(dailyOutfits.length / itemsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const currentOutfits = dailyOutfits.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="h-5 w-5 text-amber-500" />
      case "cloudy":
      case "partly cloudy":
        return <Cloud className="h-5 w-5 text-slate-400" />
      case "rainy":
      case "rain":
        return <CloudRain className="h-5 w-5 text-slate-500" />
      default:
        return <Sun className="h-5 w-5 text-amber-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Outfit Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            These outfit recommendations are based on your trip duration, weather conditions, and planned activities.
            {gender !== "neutral" && ` Recommendations are customized for ${gender} travelers.`}
            Adjust as needed based on your personal style and preferences.
          </p>

          <div className="grid grid-cols-1 gap-6">
            {currentOutfits.map((outfit) => (
              <Card key={outfit.day} className="overflow-hidden">
                <CardHeader className="bg-slate-50 pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-slate-500" />
                      <h3 className="font-medium">
                        Day {outfit.day}: {format(outfit.date, "EEE, MMM d")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {outfit.weatherConditions && getWeatherIcon(outfit.weatherConditions.description)}
                      <span className="text-sm">
                        {outfit.weatherConditions ? `${Math.round(outfit.weatherConditions.temperature)}°C` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {outfit.activities.map((activity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <Tabs defaultValue="daytime">
                    <TabsList className="mb-2">
                      <TabsTrigger value="daytime">Daytime Outfit</TabsTrigger>
                      {outfit.evening && <TabsTrigger value="evening">Evening Outfit</TabsTrigger>}
                    </TabsList>

                    <TabsContent value="daytime" className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-500">Top</h4>
                          <p>{outfit.daytime.top}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-500">Bottom</h4>
                          <p>{outfit.daytime.bottom}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-500">Shoes</h4>
                          <p>{outfit.daytime.shoes}</p>
                        </div>

                        {outfit.daytime.outerwear && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-500">Outerwear</h4>
                            <p>{outfit.daytime.outerwear}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-500">Accessories</h4>
                        <ul className="list-disc pl-5 text-sm">
                          {outfit.daytime.accessories.map((accessory, index) => (
                            <li key={index}>{accessory}</li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    {outfit.evening && (
                      <TabsContent value="evening" className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-slate-500">Top</h4>
                            <p>{outfit.evening.top}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-slate-500">Bottom</h4>
                            <p>{outfit.evening.bottom}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-slate-500">Shoes</h4>
                            <p>{outfit.evening.shoes}</p>
                          </div>

                          {outfit.evening.outerwear && (
                            <div>
                              <h4 className="text-sm font-medium text-slate-500">Outerwear</h4>
                              <p>{outfit.evening.outerwear}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-500">Accessories</h4>
                          <ul className="list-disc pl-5 text-sm">
                            {outfit.evening.accessories.map((accessory, index) => (
                              <li key={index}>{accessory}</li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-slate-500">
              Page {currentPage + 1} of {totalPages}
            </div>

            <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outfit Planning Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Mix and Match Strategy</h3>
            <p className="text-sm text-slate-600 mt-1">
              The outfits above are designed to be mixed and matched. Pack items in complementary colors to maximize
              combinations.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Layering for Weather Changes</h3>
            <p className="text-sm text-slate-600 mt-1">
              Weather can be unpredictable. Layering allows you to adapt to changing conditions throughout the day.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Outfit Recycling</h3>
            <p className="text-sm text-slate-600 mt-1">
              For longer trips, plan to wear some items multiple times. Bottoms like jeans and pants can typically be
              worn 2-3 times before washing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Local Cultural Considerations</h3>
            <p className="text-sm text-slate-600 mt-1">
              Research local dress codes, especially for religious sites or formal venues. Some places may require
              covered shoulders, knees, or head coverings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

