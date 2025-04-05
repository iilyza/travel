"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackingList } from "@/components/packing-list"
import { WeatherDisplay } from "@/components/weather-display"
import { generatePackingList } from "@/lib/packing-logic"
import { TripSummary } from "@/components/trip-summary"
import { PackingStrategy } from "@/components/packing-strategy"
import { PackingNotes } from "@/components/packing-notes"
import { OutfitGuide } from "@/components/outfit-guide"
import type { PackingItem } from "@/lib/types"

export default function PackingListPage() {
  const searchParams = useSearchParams()
  const [packingList, setPackingList] = useState<Record<string, PackingItem[]>>({})
  const [tripDetails, setTripDetails] = useState({
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    tripPurposes: [] as string[],
    otherPurpose: "",
    accommodations: [] as string[],
    customAccommodation: "",
    duration: 0,
    hasItinerary: false,
    luggageType: "",
    itineraryText: "",
    gender: "neutral" as "male" | "female" | "neutral",
  })
  const [packingNotes, setPackingNotes] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    if (searchParams && !isInitialized) {
      try {
        const destination = searchParams.get("destination") || ""
        const country = searchParams.get("country") || ""

        const startDate = searchParams.get("startDate") || ""
        const endDate = searchParams.get("endDate") || ""

        const tripPurposesParam = searchParams.get("tripPurposes") || "[]"
        const tripPurposes = JSON.parse(tripPurposesParam) as string[]

        const otherPurpose = searchParams.get("otherPurpose") || ""

        const accommodationsParam = searchParams.get("accommodations") || "[]"
        const accommodations = JSON.parse(accommodationsParam) as string[]

        const customAccommodation = searchParams.get("customAccommodation") || ""
        const duration = Number.parseInt(searchParams.get("duration") || "0", 10)
        const hasItinerary = searchParams.get("hasItinerary") === "true"
        const luggageType = searchParams.get("luggageType") || ""
        const itineraryText = searchParams.get("itineraryText") || ""
        const gender = (searchParams.get("gender") || "neutral") as "male" | "female" | "neutral"

        // Parse locations from destination
        const locationsList = destination
          .split(",")
          .map((loc) => loc.trim())
          .filter(Boolean)
        setLocations(locationsList.length > 0 ? locationsList : ["Your destination"])

        setTripDetails({
          destination,
          country,
          startDate,
          endDate,
          tripPurposes,
          otherPurpose,
          accommodations,
          customAccommodation,
          duration,
          hasItinerary,
          luggageType,
          itineraryText,
          gender,
        })

        // Generate packing list based on trip details
        const generatedList = generatePackingList({
          duration,
          tripPurposes,
          otherPurpose,
          accommodations,
          gender,
        })

        setPackingList(generatedList)
        setIsInitialized(true)
      } catch (error) {
        console.error("Error parsing URL parameters:", error)
      }
    }
  }, [searchParams, isInitialized])

  const handleNotesChange = (notes: string) => {
    setPackingNotes(notes)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trip Form
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Packing List</h1>
          <p className="text-slate-600">
            Customized based on your {tripDetails.duration}-day trip to {tripDetails.destination}
            {tripDetails.hasItinerary && " (with itinerary)"}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TripSummary tripDetails={tripDetails} />
          <WeatherDisplay locations={locations} />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="essentials">Essentials</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="toiletries">Toiletries</TabsTrigger>
            <TabsTrigger value="electronics">Electronics</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="outfits">Daily Outfits</TabsTrigger>
            {tripDetails.luggageType && <TabsTrigger value="strategy">Packing Strategy</TabsTrigger>}
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <PackingList items={packingList} filter="all" />
          </TabsContent>

          <TabsContent value="essentials">
            <PackingList items={packingList} filter="essentials" />
          </TabsContent>

          <TabsContent value="clothing">
            <PackingList items={packingList} filter="clothing" />
          </TabsContent>

          <TabsContent value="toiletries">
            <PackingList items={packingList} filter="toiletries" />
          </TabsContent>

          <TabsContent value="electronics">
            <PackingList items={packingList} filter="electronics" />
          </TabsContent>

          <TabsContent value="documents">
            <PackingList items={packingList} filter="documents" />
          </TabsContent>

          <TabsContent value="activities">
            <PackingList items={packingList} filter="activities" />
          </TabsContent>

          <TabsContent value="outfits">
            <OutfitGuide
              duration={tripDetails.duration}
              startDate={tripDetails.startDate}
              tripPurposes={tripDetails.tripPurposes}
              itinerary={tripDetails.itineraryText}
              destination={tripDetails.destination}
              gender={tripDetails.gender}
            />
          </TabsContent>

          {tripDetails.luggageType && (
            <TabsContent value="strategy">
              <PackingStrategy luggageType={tripDetails.luggageType} />
            </TabsContent>
          )}

          <TabsContent value="notes">
            <PackingNotes notes={packingNotes} onNotesChange={handleNotesChange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

