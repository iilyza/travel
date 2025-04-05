'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const TRIP_PURPOSES = [
  { id: 'business', label: 'Business' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'beach', label: 'Beach' },
  { id: 'hiking', label: 'Hiking' },
  { id: 'city', label: 'City Exploration' },
]

export default function NewTripPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tripPurposes: [] as string[],
    itinerary: '',
    gender: 'neutral' as 'male' | 'female' | 'neutral',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      const { error } = await supabase.from('trips').insert({
        user_id: session.user.id,
        destination: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        duration,
        trip_purposes: formData.tripPurposes,
        itinerary: formData.itinerary || null,
        gender: formData.gender,
      })

      if (error) throw error

      router.push('/trips')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Trip</CardTitle>
          <CardDescription>Fill in the details of your upcoming trip</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Where are you going?"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trip Purposes</Label>
              <div className="grid grid-cols-2 gap-2">
                {TRIP_PURPOSES.map((purpose) => (
                  <div key={purpose.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={purpose.id}
                      checked={formData.tripPurposes.includes(purpose.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            tripPurposes: [...formData.tripPurposes, purpose.id],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            tripPurposes: formData.tripPurposes.filter((id) => id !== purpose.id),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={purpose.id}>{purpose.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itinerary">Itinerary (Optional)</Label>
              <Textarea
                id="itinerary"
                placeholder="Enter your trip itinerary..."
                value={formData.itinerary}
                onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value as 'male' | 'female' | 'neutral' })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </div>
              </RadioGroup>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating trip...' : 'Create Trip'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 