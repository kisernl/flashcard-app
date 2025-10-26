"use client"

import Image from "next/image"
import Link from "next/link"
import { AppHeader} from "@/components/header"
import { Button } from "@/components/ui/button"
import { AppFooter } from "@/components/footer"
import { AuthModal } from "@/components/AuthModal"
import { useAuth } from "@/context/AuthContext"
import { ArrowRight } from "lucide-react"

function GetStartedButton() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Button size="lg" disabled className="font-semibold">
        Loading...
      </Button>
    );
  }
  
  if (isAuthenticated) {
    return (
      <Link href="/app">
        <Button size="lg" className="font-semibold">
          Go to App <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    );
  }
  
  return (
    <AuthModal 
      triggerText="Get Started"
      defaultMode="signup"
      size="lg"
      showArrow={true}
    />
  );
}

function SignUpButton() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Button size="lg" disabled>
        Loading...
      </Button>
    );
  }
  
  if (isAuthenticated) {
    return (
      <Link href="/app">
        <Button size="lg">
          Go to Dashboard
        </Button>
      </Link>
    );
  }
  
  return (
    <AuthModal 
      triggerText="Sign Up Free"
      defaultMode="signup"
      size="lg"
    />
  );
}

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
                  <GetStartedButton />
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
  
    
      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How CapireIQ Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple ways to create flashcards, designed for the AI era
            </p>
          </div>

          {/* Three Main Methods */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* AI-First Creation */}
            <div className="bg-background rounded-xl p-8 border border-border shadow-sm">
              <div className="text-6xl font-bold text-primary/20 mb-4">01</div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Creation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ask your favorite AI chatbot to create a CSV for flashcards on any topic, or share your class notes 
                and request CSV flashcard entries. <span className="font-semibold text-foreground">Just copy and paste</span> to create 
                a deck of custom flashcards.
              </p>
            </div>

            {/* CSV Upload */}
            <div className="bg-background rounded-xl p-8 border border-border shadow-sm">
              <div className="text-6xl font-bold text-primary/20 mb-4">02</div>
              <h3 className="text-2xl font-bold mb-4">Direct CSV Upload</h3>
              <p className="text-muted-foreground leading-relaxed">
                Already have a CSV file? <span className="font-semibold text-foreground">Upload it directly</span> to create 
                your flashcard deck instantly. No formatting hassles, no manual entry required.
              </p>
            </div>

            {/* Manual Creation */}
            <div className="bg-background rounded-xl p-8 border border-border shadow-sm">
              <div className="text-6xl font-bold text-primary/20 mb-4">03</div>
              <h3 className="text-2xl font-bold mb-4">Manual Card Builder</h3>
              <p className="text-muted-foreground leading-relaxed">
                Prefer hands-on control? Create individual cards manually with our 
                <span className="font-semibold text-foreground"> intuitive interface</span>. Perfect for quick additions.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Plus Smart Organization & Review</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Stack Organization</h4>
                <p className="text-muted-foreground">
                  Organize your cards into <span className="font-medium text-foreground">stacks of related decks</span> for 
                  structured learning paths.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Smart Review</h4>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Mark cards to review only the ones you missed</span> next 
                  time around. Study smarter, not harder.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Easy Expansion</h4>
                <p className="text-muted-foreground">
                  Need to add more cards to your deck? <span className="font-medium text-foreground">No problem.</span> 
                  Expand existing decks anytime.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">AI-Powered Learning</h4>
                <p className="text-muted-foreground">
                  Harness the <span className="font-medium text-foreground">free resources of AI chatbots</span> for 
                  distraction-free flashcard creation.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <div className="text-center mt-16 max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-4">
              This app is designed to help you harness the free resources you have in your favorite AI chatbots to create 
              <span className="font-semibold text-foreground"> distraction-free flashcards</span>.
            </p>
            <p className="text-xl">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
                Give us a try — CapireIQ is free while in Beta!
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Start studying smarter today</h2>
        <p className="text-muted-foreground mb-8">
          It only takes a few seconds to start building your own flashcard decks.
        </p>
        <SignUpButton />
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
