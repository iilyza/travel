import { format } from "date-fns"
import { Calendar, MapPin, Home, Tag, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TripSummaryProps {
  tripDetails: {
    destination: string
    country: string
    startDate: string
    endDate: string
    tripPurposes: string[]
    accommodations: string[]
    duration: number
    hasItinerary?: boolean
    luggageType?: string
  }
}

export function TripSummary({ tripDetails }: TripSummaryProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  const getTripPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case "city":
        return "City Exploration"
      case "beach":
        return "Beach Vacation"
      case "outdoor":
        return "Outdoor Adventure"
      case "business":
        return "Business Trip"
      default:
        return purpose
    }
  }

  const getAccommodationLabel = (accommodation: string) => {
    switch (accommodation) {
      case "hotel":
        return "Hotel"
      case "hostel":
        return "Hostel"
      case "rental":
        return "Rental/Airbnb"
      case "camping":
        return "Camping"
      case "yurt":
        return "Yurt"
      case "homestay":
        return "Homestay"
      default:
        return accommodation
    }
  }

  const getLuggageTypeLabel = (luggageType: string) => {
    switch (luggageType) {
      case "carry-on":
        return "Carry-on Suitcase"
      case "checked":
        return "Checked Suitcase"
      case "backpack-small":
        return "Small Backpack (20-35L)"
      case "backpack-medium":
        return "Medium Backpack (36-50L)"
      case "backpack-large":
        return "Large Backpack (50L+)"
      case "duffel":
        return "Duffel Bag"
      case "osprey-fairview":
        return "Osprey Fairview/Farpoint"
      default:
        return luggageType
    }
  }

  // Parse multiple cities from the destination string
  const cities = tripDetails.destination
    .split(",")
    .map((city) => city.trim())
    .filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Destination</p>
              {cities.length > 0 ? (
                <ul className="text-sm text-slate-500 space-y-1 mt-1">
                  {cities.map((city, index) => (
                    <li key={index}>
                      {city}, {tripDetails.country}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">{tripDetails.country}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{tripDetails.duration} days</p>
              <p className="text-sm text-slate-500">
                {formatDate(tripDetails.startDate)} - {formatDate(tripDetails.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Home className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Accommodation</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {tripDetails.accommodations.map((accommodation) => (
                  <Badge key={accommodation} variant="secondary" className="capitalize">
                    {getAccommodationLabel(accommodation)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {tripDetails.luggageType && (
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Luggage</p>
                <p className="text-sm text-slate-500">{getLuggageTypeLabel(tripDetails.luggageType)}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <Tag className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Trip Purposes</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {tripDetails.tripPurposes.map((purpose) => (
                  <Badge key={purpose} variant="secondary" className="capitalize">
                    {getTripPurposeLabel(purpose)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {tripDetails.hasItinerary && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Itinerary:</span> Your packing list has been customized based on your
                uploaded itinerary. Your packing list has been customized based on your uploaded itinerary.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

