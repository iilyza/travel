'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/types/database.types'

type Trip = Database['public']['Tables']['trips']['Row']

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setTrips(data || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button asChild>
          <Link href="/trips/new">Create New Trip</Link>
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">No trips found. Create your first trip to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle>{trip.destination}</CardTitle>
                <CardDescription>
                  {format(new Date(trip.start_date), 'MMM d, yyyy')} -{' '}
                  {format(new Date(trip.end_date), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  {trip.duration} days • {trip.trip_purposes.join(', ')}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/trips/${trip.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 