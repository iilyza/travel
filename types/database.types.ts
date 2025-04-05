export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string
          created_at: string
          user_id: string
          destination: string
          start_date: string
          end_date: string
          duration: number
          trip_purposes: string[]
          itinerary: string | null
          gender: 'male' | 'female' | 'neutral'
          weather_data: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          destination: string
          start_date: string
          end_date: string
          duration: number
          trip_purposes: string[]
          itinerary?: string | null
          gender?: 'male' | 'female' | 'neutral'
          weather_data?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          destination?: string
          start_date?: string
          end_date?: string
          duration?: number
          trip_purposes?: string[]
          itinerary?: string | null
          gender?: 'male' | 'female' | 'neutral'
          weather_data?: Json | null
        }
      }
      packing_lists: {
        Row: {
          id: string
          created_at: string
          trip_id: string
          items: Json
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          trip_id: string
          items: Json
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          trip_id?: string
          items?: Json
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 