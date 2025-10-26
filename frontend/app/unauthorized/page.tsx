// app/unauthorized/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogIn } from "lucide-react"
import { AppHeader } from "@/components/header"
import { AppFooter } from "@/components/footer"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
    <AppHeader />
    <main className="flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Access Restricted</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        You need to be logged in to view this page.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Home
        </Button>
      </div>
    </main>
    <AppFooter />
    </div>
  )
}
