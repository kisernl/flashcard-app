"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { AppHeader } from "@/components/header"
import { AppFooter } from "@/components/footer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/unauthorized")
    }
  }, [loading, isAuthenticated, router])

  // While checking session, show a loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg">Checking authentication...</p>
      </div>
    )
  }

  // Only render children if authenticated
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">{children}</main>
    </div>
  )
}
