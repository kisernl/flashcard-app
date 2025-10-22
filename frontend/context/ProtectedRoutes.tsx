"use client"

import { useState, useEffect } from "react"
import { Upload } from "@/components/upload"
import { DeckList } from "@/components/deck-list"
import { StackList } from "@/components/stack-list"
import { StudyMode } from "@/components/study-mode"
import { Search } from "@/components/search"
import { Button } from "@/components/ui/button"
import { ArrowLeft, SearchIcon } from "lucide-react"
import type { Deck, Stack } from "@/lib/types"
import { getStacks, getDecksForStack, resetDeck } from "@/lib/api"

type View = "stacks" | "decks" | "study" | "search"

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("stacks")
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [showMissedOnly, setShowMissedOnly] = useState(false)
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stacks, setStacks] = useState<Stack[]>([])

  // Load stacks
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        const loadedStacks = await getStacks()
        setStacks(loadedStacks)
      } catch (error) {
        console.error("Failed to load stacks:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialData()
  }, [])

  const refreshDecks = async () => {
    if (selectedStack) {
      try {
        const loadedDecks = await getDecksForStack(selectedStack.id)
        setDecks(loadedDecks)
      } catch (error) {
        console.error("Failed to refresh decks:", error)
      }
    }
  }

  const handleSelectStack = async (stack: Stack) => {
    setIsLoading(true)
    try {
      const loadedDecks = await getDecksForStack(stack.id)
      setDecks(loadedDecks)
      setSelectedStack(stack)
      setCurrentView("decks")
    } catch (error) {
      console.error("Failed to load decks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectDeck = (deck: Deck, missedOnly = false) => {
    setSelectedDeck(deck)
    setShowMissedOnly(missedOnly)
    setCurrentView("study")
  }

  const handleBackToStacks = () => {
    setSelectedStack(null)
    setCurrentView("stacks")
  }

  const handleBackToDecks = async () => {
    setSelectedDeck(null)
    setShowMissedOnly(false)
    setCurrentView("decks")
    await refreshDecks()
  }

  const handleSearchClick = () => setCurrentView("search")
  const handleBackFromSearch = () => setCurrentView("stacks")

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium text-foreground">Loading flashcards...</div>
          <div className="text-sm text-muted-foreground">Initializing database</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            {currentView === "decks" && (
              <Button variant="ghost" size="icon" onClick={handleBackToStacks}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {currentView === "study" && (
              <Button variant="ghost" size="icon" onClick={handleBackToDecks}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {currentView === "search" && (
              <Button variant="ghost" size="icon" onClick={handleBackFromSearch}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {currentView === "stacks" && "Flashcards"}
              {currentView === "decks" && selectedStack?.name}
              {currentView === "study" && selectedDeck?.title}
              {currentView === "search" && "Search"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {currentView !== "search" && currentView !== "study" && (
              <Button variant="ghost" size="icon" onClick={handleSearchClick}>
                <SearchIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {currentView === "stacks" && <StackList onSelectStack={handleSelectStack} />}
        {currentView === "decks" && selectedStack && (
          <div className="space-y-8">
            <Upload onUploadComplete={refreshDecks} selectedStackId={selectedStack.id} />
            <DeckList decks={decks} onSelectDeck={handleSelectDeck} onDeckDeleted={refreshDecks} onResetDeck={resetDeck} />
          </div>
        )}
        {currentView === "study" && selectedDeck && (
          <StudyMode deck={selectedDeck} showMissedOnly={showMissedOnly} onBack={handleBackToDecks} />
        )}
        {currentView === "search" && <Search onSelectDeck={(deck) => handleSelectDeck(deck, false)} />}
      </main>
    </>
  )
}
