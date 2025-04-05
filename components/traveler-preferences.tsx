"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface TravelerPreferencesProps {
  onComplete: (preferences: any) => void
}

export function TravelerPreferences({ onComplete }: TravelerPreferencesProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    dietaryRestrictions: [] as string[],
    medicalConditions: [] as string[],
    allergies: [] as string[],
    mobilityNeeds: [] as string[],
    specialRequirements: "",
    travelStyle: "",
    comfortLevel: "",
    budgetPreference: "",
    techNeeds: [] as string[],
    entertainmentPreferences: [] as string[],
    sleepPreferences: [] as string[],
    additionalNotes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return { ...prev, [name]: newValues }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Traveler Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dietary Restrictions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Vegetarian", "Vegan", "Gluten-free", "Lactose-free", "Halal", "Kosher"].map((restriction) => (
                <div key={restriction} className="flex items-center space-x-2">
                  <Checkbox
                    id={restriction}
                    checked={formData.dietaryRestrictions.includes(restriction)}
                    onCheckedChange={() => handleCheckboxChange("dietaryRestrictions", restriction)}
                  />
                  <Label htmlFor={restriction}>{restriction}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Diabetes", "Asthma", "Heart condition", "Epilepsy", "Arthritis", "Other"].map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.medicalConditions.includes(condition)}
                    onCheckedChange={() => handleCheckboxChange("medicalConditions", condition)}
                  />
                  <Label htmlFor={condition}>{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Peanuts", "Shellfish", "Dairy", "Pollen", "Dust", "Other"].map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onCheckedChange={() => handleCheckboxChange("allergies", allergy)}
                  />
                  <Label htmlFor={allergy}>{allergy}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mobility Needs</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Wheelchair", "Walking aid", "Limited mobility", "None"].map((need) => (
                <div key={need} className="flex items-center space-x-2">
                  <Checkbox
                    id={need}
                    checked={formData.mobilityNeeds.includes(need)}
                    onCheckedChange={() => handleCheckboxChange("mobilityNeeds", need)}
                  />
                  <Label htmlFor={need}>{need}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Travel Style</Label>
            <Select
              value={formData.travelStyle}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backpacker">Backpacker</SelectItem>
                <SelectItem value="budget">Budget Traveler</SelectItem>
                <SelectItem value="luxury">Luxury Traveler</SelectItem>
                <SelectItem value="business">Business Traveler</SelectItem>
                <SelectItem value="family">Family Traveler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Comfort Level</Label>
            <Select
              value={formData.comfortLevel}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, comfortLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your comfort level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal (Just the essentials)</SelectItem>
                <SelectItem value="balanced">Balanced (Comfortable but practical)</SelectItem>
                <SelectItem value="luxury">Luxury (All comforts of home)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget Preference</Label>
            <Select
              value={formData.budgetPreference}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, budgetPreference: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your budget preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (Minimal spending)</SelectItem>
                <SelectItem value="moderate">Moderate (Balanced spending)</SelectItem>
                <SelectItem value="luxury">Luxury (Premium spending)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tech Needs</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Laptop", "Tablet", "Camera", "Smartphone", "E-reader", "Other"].map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech}
                    checked={formData.techNeeds.includes(tech)}
                    onCheckedChange={() => handleCheckboxChange("techNeeds", tech)}
                  />
                  <Label htmlFor={tech}>{tech}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Entertainment Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Books", "Music", "Movies", "Games", "Art supplies", "Other"].map((entertainment) => (
                <div key={entertainment} className="flex items-center space-x-2">
                  <Checkbox
                    id={entertainment}
                    checked={formData.entertainmentPreferences.includes(entertainment)}
                    onCheckedChange={() => handleCheckboxChange("entertainmentPreferences", entertainment)}
                  />
                  <Label htmlFor={entertainment}>{entertainment}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sleep Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Eye mask", "Ear plugs", "Travel pillow", "White noise", "Other"].map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference}
                    checked={formData.sleepPreferences.includes(preference)}
                    onCheckedChange={() => handleCheckboxChange("sleepPreferences", preference)}
                  />
                  <Label htmlFor={preference}>{preference}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Textarea
              id="specialRequirements"
              name="specialRequirements"
              placeholder="Any special requirements or considerations..."
              value={formData.specialRequirements}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Any other preferences or requirements..."
              value={formData.additionalNotes}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Preferences</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 