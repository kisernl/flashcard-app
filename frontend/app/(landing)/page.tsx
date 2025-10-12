"use client"

import Image from "next/image"
import Link from "next/link"
import { AppHeader} from "@/components/header"
import { Button } from "@/components/ui/button"
import { AppFooter } from "@/components/footer"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 py-8 md:py-16">
          <div className="w-full flex flex-col md:flex-row items-center">
            {/* Hero Content */}
            <div className="w-full md:w-1/2 lg:w-2/3 flex flex-col">  
              <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-left">
                  The easiest way to master anything — one flashcard at a time.
                </h1>
                <p className="text-lg text-muted-foreground mb-8 text-left">
                  Create decks instantly by pasting CSV data, study efficiently with “missed only” review, and keep your
                  progress organized with decks and stacks.
                </p>
                <div className="text-left">
                  <Link href="/app">
                    <Button size="lg" className="font-semibold">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Capire Definition Card */}
              <div className="w-full justify-start">
                  <div className="max-w-3xl bg-zinc-100 dark:bg-zinc-800 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            ca·pi·re
                          </h3>
                          <span className="text-sm font-medium text-muted-foreground/80">
                            /kaˈpiːre/
                          </span>
                        </div>
                        <span className="inline-block text-sm font-medium text-primary/80 uppercase tracking-wider">
                          verb (Italian)
                        </span>
                      </div>

                      {/* Definition */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <p className="text-lg leading-relaxed">
                            <span className="font-medium text-foreground">To understand; to grasp.</span> 
                            <span className="block mt-2 text-muted-foreground">
                              To comprehend the nature or meaning of something; to perceive or recognize.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

              {/* Right side - Image (1/3 width) */}
            <div className="w-full md:w-1/3 mt-12 md:mt-0 relative">
              {/* Light mode image */}
              <Image
                src="/mtn1.png"
                alt="Mountain illustration"
                width={400}
                height={400}
                className="w-full h-auto dark:hidden"
                priority
              />
              {/* Dark mode image */}
              <Image
                src="/mtn2.png"
                alt="Mountain illustration dark"
                width={600}
                height={600}
                className="w-full h-auto hidden dark:block"
                priority
              />
            </div>
          </div>
        </div>

  </div>
      {/* Features Section */}
      {/* <section className="container mx-auto grid md:grid-cols-3 gap-10 px-6 py-16">
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
      </section> */}
  
    
      {/* Screenshot Preview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">See It In Action</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            A clean, distraction-free study environment built for simplicity and speed.
          </p>
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg max-w-4xl mx-auto">
            <Image
              src="/placeholder_screenshot.png"
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

      <AppFooter />
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
