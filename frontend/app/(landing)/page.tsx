"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80">
            Flashflow
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/app">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          The easiest way to master anything — one flashcard at a time.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Create decks instantly by pasting CSV data, study efficiently with “missed only” review, and keep your
          progress organized with decks and stacks.
        </p>
        <Link href="/app">
          <Button size="lg" className="font-semibold">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto grid md:grid-cols-3 gap-10 px-6 py-16">
        <Feature
          title="📋 Simple Import"
          description="Paste your CSV data to instantly create flashcards — no manual entry needed."
        />
        <Feature
          title="🎯 Focused Study"
          description="Mark cards correct or missed to review smarter and focus on what matters."
        />
        <Feature
          title="📚 Organized Learning"
          description="Group decks into stacks for multi-topic study sessions and easy progress tracking."
        />
      </section>

      {/* Screenshot Preview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">See It In Action</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            A clean, distraction-free study environment built for simplicity and speed.
          </p>
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg max-w-4xl mx-auto">
            <Image
              src="/screenshots/app-preview.png"
              alt="App preview screenshot"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Start studying smarter today</h2>
        <p className="text-muted-foreground mb-8">
          It only takes a few seconds to start building your own flashcard decks.
        </p>
        <Link href="/app">
          <Button size="lg">Sign Up Free</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Flashflow. Built for learners, by learners.
        </p>
      </footer>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
