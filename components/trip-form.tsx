"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function TripForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    tripPurposes: [] as string[],
    otherPurpose: "",
    accommodations: [] as string[],
    customAccommodation: "",
    itinerary: null as File | null,
    itineraryText: "",
    luggageType: "",
    customLuggageType: "",
    gender: "neutral" as "male" | "female" | "neutral",
  })

  // Load traveler preferences from localStorage
  useEffect(() => {
    const storedPreferences = localStorage.getItem("travelerPreferences")
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences)
      // Update form data with relevant preferences
      setFormData(prev => ({
        ...prev,
        gender: preferences.gender || "neutral"
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, itinerary: e.target.files![0] }))

      // Read the file content if it's a text file
      const file = e.target.files[0]
      if (file.type === "text/plain") {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target) {
            setFormData((prev) => ({
              ...prev,
              itineraryText: event.target!.result as string,
            }))
          }
        }
        reader.readAsText(file)
      }
    }
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  const handleTripPurposeChange = (purpose: string, isChecked: boolean) => {
    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        tripPurposes: [...prev.tripPurposes, purpose],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        tripPurposes: prev.tripPurposes.filter((p) => p !== purpose),
      }))
    }
  }

  const handleAccommodationChange = (accommodation: string, isChecked: boolean) => {
    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        accommodations: [...prev.accommodations, accommodation],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        accommodations: prev.accommodations.filter((a) => a !== accommodation),
      }))
    }
  }

  const handleGenderChange = (value: "male" | "female" | "neutral") => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.destination ||
      !formData.country ||
      !formData.startDate ||
      !formData.endDate ||
      formData.tripPurposes.length === 0 ||
      formData.accommodations.length === 0
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to generate your packing list.",
        variant: "destructive",
      })
      return
    }

    // If "other" purpose is selected, check if custom purpose is provided
    if (formData.tripPurposes.includes("other") && !formData.otherPurpose) {
      toast({
        title: "Missing information",
        description: "Please specify your custom trip purpose.",
        variant: "destructive",
      })
      return
    }

    // If "other" accommodation is selected, check if custom accommodation is provided
    if (formData.accommodations.includes("other") && !formData.customAccommodation) {
      toast({
        title: "Missing information",
        description: "Please specify your custom accommodation type.",
        variant: "destructive",
      })
      return
    }

    // If "other" luggage type is selected, check if custom luggage type is provided
    if (formData.luggageType === "other" && !formData.customLuggageType) {
      toast({
        title: "Missing information",
        description: "Please specify your custom luggage type.",
        variant: "destructive",
      })
      return
    }

    // Calculate trip duration
    const duration = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))

    if (duration < 1) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // In a real app, we would fetch weather data here
    // For now, we'll simulate a delay and redirect to the packing list page
    setTimeout(() => {
      const finalLuggageType = formData.luggageType === "other" ? formData.customLuggageType : formData.luggageType

      const queryParams = new URLSearchParams({
        destination: formData.destination,
        country: formData.country,
        startDate: formData.startDate?.toISOString() || "",
        endDate: formData.endDate?.toISOString() || "",
        tripPurposes: JSON.stringify(formData.tripPurposes),
        otherPurpose: formData.otherPurpose,
        accommodations: JSON.stringify(formData.accommodations),
        customAccommodation: formData.customAccommodation,
        duration: duration.toString(),
        hasItinerary: formData.itineraryText ? "true" : "false",
        luggageType: finalLuggageType,
        itineraryText: formData.itineraryText,
        gender: formData.gender,
      })

      router.push(`/packing-list?${queryParams.toString()}`)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Trip Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destinations / Cities / Locations</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="e.g., Paris, Lyon, Nice"
                value={formData.destination}
                onChange={handleInputChange}
              />
              <p className="text-xs text-slate-500">Enter multiple locations separated by commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="e.g., France"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Trip Purpose (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purpose-city"
                  checked={formData.tripPurposes.includes("city")}
                  onCheckedChange={(checked) => handleTripPurposeChange("city", checked as boolean)}
                />
                <Label htmlFor="purpose-city">City Exploration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purpose-beach"
                  checked={formData.tripPurposes.includes("beach")}
                  onCheckedChange={(checked) => handleTripPurposeChange("beach", checked as boolean)}
                />
                <Label htmlFor="purpose-beach">Beach Vacation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purpose-outdoor"
                  checked={formData.tripPurposes.includes("outdoor")}
                  onCheckedChange={(checked) => handleTripPurposeChange("outdoor", checked as boolean)}
                />
                <Label htmlFor="purpose-outdoor">Outdoor Adventure</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purpose-business"
                  checked={formData.tripPurposes.includes("business")}
                  onCheckedChange={(checked) => handleTripPurposeChange("business", checked as boolean)}
                />
                <Label htmlFor="purpose-business">Business Trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purpose-other"
                  checked={formData.tripPurposes.includes("other")}
                  onCheckedChange={(checked) => handleTripPurposeChange("other", checked as boolean)}
                />
                <Label htmlFor="purpose-other">Other</Label>
              </div>
            </div>

            {formData.tripPurposes.includes("other") && (
              <div className="mt-2">
                <Input
                  id="otherPurpose"
                  name="otherPurpose"
                  placeholder="Specify your trip purpose"
                  value={formData.otherPurpose}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {formData.tripPurposes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tripPurposes.map((purpose) => (
                  <Badge key={purpose} variant="secondary" className="capitalize">
                    {purpose === "city"
                      ? "City Exploration"
                      : purpose === "beach"
                        ? "Beach Vacation"
                        : purpose === "outdoor"
                          ? "Outdoor Adventure"
                          : purpose === "business"
                            ? "Business Trip"
                            : formData.otherPurpose || "Other"}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Accommodation Type (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-hotel"
                  checked={formData.accommodations.includes("hotel")}
                  onCheckedChange={(checked) => handleAccommodationChange("hotel", checked as boolean)}
                />
                <Label htmlFor="accommodation-hotel">Hotel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-hostel"
                  checked={formData.accommodations.includes("hostel")}
                  onCheckedChange={(checked) => handleAccommodationChange("hostel", checked as boolean)}
                />
                <Label htmlFor="accommodation-hostel">Hostel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-rental"
                  checked={formData.accommodations.includes("rental")}
                  onCheckedChange={(checked) => handleAccommodationChange("rental", checked as boolean)}
                />
                <Label htmlFor="accommodation-rental">Rental/Airbnb</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-camping"
                  checked={formData.accommodations.includes("camping")}
                  onCheckedChange={(checked) => handleAccommodationChange("camping", checked as boolean)}
                />
                <Label htmlFor="accommodation-camping">Camping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-yurt"
                  checked={formData.accommodations.includes("yurt")}
                  onCheckedChange={(checked) => handleAccommodationChange("yurt", checked as boolean)}
                />
                <Label htmlFor="accommodation-yurt">Yurt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-homestay"
                  checked={formData.accommodations.includes("homestay")}
                  onCheckedChange={(checked) => handleAccommodationChange("homestay", checked as boolean)}
                />
                <Label htmlFor="accommodation-homestay">Homestay</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accommodation-other"
                  checked={formData.accommodations.includes("other")}
                  onCheckedChange={(checked) => handleAccommodationChange("other", checked as boolean)}
                />
                <Label htmlFor="accommodation-other">Other</Label>
              </div>
            </div>

            {formData.accommodations.includes("other") && (
              <div className="mt-2">
                <Input
                  id="customAccommodation"
                  name="customAccommodation"
                  placeholder="Specify accommodation type"
                  value={formData.customAccommodation}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {formData.accommodations.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.accommodations.map((accommodation) => (
                  <Badge key={accommodation} variant="secondary" className="capitalize">
                    {accommodation === "other" ? formData.customAccommodation || "Other" : accommodation}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Customize Packing List By Gender</Label>
            <RadioGroup
              defaultValue="neutral"
              value={formData.gender}
              onValueChange={(value) => handleGenderChange(value as "male" | "female" | "neutral")}
              className="flex flex-row space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="gender-male" />
                <Label htmlFor="gender-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="gender-female" />
                <Label htmlFor="gender-female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="gender-neutral" />
                <Label htmlFor="gender-neutral">Gender Neutral</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="luggageType">Luggage/Backpack Type (Optional)</Label>
            <div className="grid grid-cols-1 gap-2">
              <select
                id="luggageType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.luggageType}
                onChange={(e) => setFormData((prev) => ({ ...prev, luggageType: e.target.value }))}
              >
                <option value="">Select luggage type</option>
                <option value="carry-on">Carry-on Suitcase</option>
                <option value="checked">Checked Suitcase</option>
                <option value="backpack-small">Small Backpack (20-35L)</option>
                <option value="backpack-medium">Medium Backpack (36-50L)</option>
                <option value="backpack-large">Large Backpack (50L+)</option>
                <option value="duffel">Duffel Bag</option>
                <option value="osprey-fairview">Osprey Fairview/Farpoint</option>
                <option value="other">Other (specify)</option>
              </select>

              {formData.luggageType === "other" && (
                <div className="mt-2">
                  <Input
                    id="customLuggageType"
                    name="customLuggageType"
                    placeholder="Specify luggage/backpack model"
                    value={formData.customLuggageType}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itinerary">Trip Itinerary (Optional)</Label>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Input
                  id="itinerary"
                  name="itinerary"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" className="shrink-0" disabled={!formData.itinerary}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Upload your trip itinerary to get a more personalized packing list
              </p>

              {!formData.itinerary && (
                <div className="mt-2">
                  <Label htmlFor="itineraryText">Or enter your itinerary details below:</Label>
                  <Textarea
                    id="itineraryText"
                    name="itineraryText"
                    placeholder="Day 1: Arrive in Paris, visit Eiffel Tower&#10;Day 2: Louvre Museum, Seine River cruise&#10;Day 3: Day trip to Versailles..."
                    value={formData.itineraryText}
                    onChange={handleInputChange}
                    className="min-h-[100px] mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating packing list...
            </>
          ) : (
            "Generate Packing List"
          )}
        </Button>
      </form>
    </Card>
  )
}

