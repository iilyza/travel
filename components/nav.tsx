'use client'

import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'

export function Nav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Travel Packing Optimizer
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/trips">My Trips</Link>
          </Button>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
} 