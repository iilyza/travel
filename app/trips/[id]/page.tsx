'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { OutfitGuide } from '@/components/outfit-guide'
import { WeatherDisplay } from '@/components/weather-display'
import type { Database } from '@/types/database.types'

type Trip = Database['public']['Tables']['trips']['Row']
type PackingList = Database['public']['Tables']['packing_lists']['Row']

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [packingList, setPackingList] = useState<PackingList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setTrip(data)

        const { data: packingData, error: packingError } = await supabase
          .from('packing_lists')
          .select('*')
          .eq('trip_id', params.id)
          .single()

        if (packingError && packingError.code !== 'PGRST116') throw packingError
        setPackingList(packingData)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [params.id])

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!trip) {
    return <div className="text-center">Trip not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{trip.destination}</h1>
          <p className="text-slate-500">
            {format(new Date(trip.start_date), 'MMM d, yyyy')} -{' '}
            {format(new Date(trip.end_date), 'MMM d, yyyy')}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/trips')}>
          Back to Trips
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Duration</h3>
              <p>{trip.duration} days</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">Trip Purposes</h3>
              <p>{trip.trip_purposes.join(', ')}</p>
            </div>
            {trip.itinerary && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Itinerary</h3>
                <p className="whitespace-pre-line">{trip.itinerary}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <WeatherDisplay locations={[trip.destination]} />
      </div>

      <OutfitGuide
        duration={trip.duration}
        startDate={trip.start_date}
        tripPurposes={trip.trip_purposes}
        itinerary={trip.itinerary || undefined}
        destination={trip.destination}
        gender={trip.gender}
      />

      {packingList && (
        <Card>
          <CardHeader>
            <CardTitle>Packing List</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{JSON.stringify(packingList.items, null, 2)}</pre>
          </CardContent>
          {packingList.notes && (
            <CardFooter>
              <p className="text-sm text-slate-500">{packingList.notes}</p>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  )
} 