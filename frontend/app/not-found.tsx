"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { AppHeader } from "@/components/header"
import { AppFooter } from "@/components/footer"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
      <AppHeader />
      <main className="flex flex-col items-center justify-center bg-background text-foreground p-6 text-center flex-1">
        {/* Large 404 */}
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        
        {/* Main heading */}
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        {/* Subheading */}
        <p className="text-xl text-muted-foreground mb-2">
          Oops! This page seems to have wandered off.
        </p>
        
        {/* Description */}
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-semibold"
          >
            <Home className="w-4 h-4" /> Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}