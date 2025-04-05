"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface PackingNotesProps {
  notes: string
  onNotesChange: (notes: string) => void
}

export function PackingNotes({ notes, onNotesChange }: PackingNotesProps) {
  const [localNotes, setLocalNotes] = useState(notes)
  const [isSaved, setIsSaved] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value)
    setIsSaved(false)
  }

  const handleSave = () => {
    onNotesChange(localNotes)
    setIsSaved(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Packing Notes</span>
          <Button
            onClick={handleSave}
            disabled={isSaved}
            size="sm"
            className={isSaved ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaved ? "Saved" : "Save Notes"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Use this space to add any additional notes about your packing list, special items to remember, or packing
            tips for your trip.
          </p>

          <Textarea
            placeholder="Add your packing notes here..."
            className="min-h-[200px]"
            value={localNotes}
            onChange={handleChange}
          />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Suggested Notes:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
              <li>Special items needed for specific activities</li>
              <li>Medication schedules and storage requirements</li>
              <li>Local purchase plans (items you'll buy at your destination)</li>
              <li>Packing reminders for the return trip</li>
              <li>Weight restrictions for your flights</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

