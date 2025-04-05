import { TripForm } from "@/components/trip-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Travel Packing Optimizer</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Create a personalized packing list based on your destinations, trip dates, and activities.
          </p>
        </header>
        <main>
          <TripForm />
        </main>
      </div>
    </div>
  )
}

