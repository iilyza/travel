"use client"

import { TravelerPreferences } from "@/components/traveler-preferences"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function TravelerPreferencesPage() {
  const router = useRouter()

  const handlePreferencesComplete = (preferences: any) => {
    // Store preferences in localStorage
    localStorage.setItem("travelerPreferences", JSON.stringify(preferences))
    
    toast({
      title: "Preferences saved",
      description: "Your travel preferences have been saved successfully.",
    })

    // Redirect to the trip form
    router.push("/trip-form")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tell Us About Yourself</h1>
      <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
        Help us create a personalized packing list by sharing your preferences and requirements.
        This information will help us suggest the most suitable items for your trip.
      </p>
      <TravelerPreferences onComplete={handlePreferencesComplete} />
    </div>
  )
} 