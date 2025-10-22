// app/unauthorized/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogIn } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Access Restricted</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        You need to be logged in to view this page. Please sign in to continue or return to the homepage.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Home
        </Button>

        <Button
          onClick={() => router.push("/?login=true")}
          className="flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" /> Login / Sign Up
        </Button>
      </div>
    </main>
  )
}
