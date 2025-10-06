"use client"

import { useState } from "react"
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { saveDeck } from "@/lib/storage"
import type { Deck } from "@/lib/types"
import { databases } from "@/lib/appwrite"

interface StudyModeProps {
  deck: Deck
  showMissedOnly: boolean
  onBack: () => void
}

export function StudyMode({ deck, showMissedOnly, onBack }: StudyModeProps) {
  const studyCards = showMissedOnly ? deck.cards.filter((card) => card.missed) : deck.cards
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const currentCard = studyCards[currentIndex]
  const progress = ((currentIndex + 1) / studyCards.length) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = async (correct: boolean) => {
    // Update the card's missed status
    const cardToUpdate = deck.cards.find((c) => c.id === currentCard.id)
    if (cardToUpdate) {
      cardToUpdate.missed = !correct
  
      // Update the card in Appwrite
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        "cards",
        cardToUpdate.id,
        {
          missed: !correct
        }
      )
    }
  
    // Save the updated deck
    await saveDeck(deck)
  
    // Move to next card or complete session
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setSessionComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
  }

  if (studyCards.length === 0) {
    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Decks
        </Button>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Check className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-lg font-medium text-foreground">No cards to study</p>
            <p className="text-center text-muted-foreground">All cards in this deck are marked as correct!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sessionComplete) {
    const missedCount = deck.cards.filter((card) => card.missed).length

    return (
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Decks
        </Button>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
            <Check className="h-16 w-16 text-foreground" />
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground">Session Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You've reviewed {studyCards.length} {studyCards.length === 1 ? "card" : "cards"}
              </p>
              {missedCount > 0 && (
                <p className="mt-1 text-destructive">
                  {missedCount} {missedCount === 1 ? "card" : "cards"} marked for review
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Study Again
              </Button>
              <Button onClick={onBack}>Back to Decks</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Decks
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {studyCards.length}
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          {showMissedOnly ? "Studying missed cards" : `Studying ${deck.title}`}
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card
          className="min-h-[400px] cursor-pointer border-border bg-card transition-all hover:shadow-lg"
          onClick={handleFlip}
        >
          <CardContent className="flex h-full min-h-[400px] items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {isFlipped ? "Answer" : "Question"}
              </p>
              <p className="text-balance text-2xl font-medium leading-relaxed text-foreground">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              {!isFlipped && <p className="mt-6 text-sm text-muted-foreground">Click to reveal answer</p>}
            </div>
          </CardContent>
        </Card>

        {isFlipped && (
          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
              size="lg"
              className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              <X className="h-5 w-5" />
              Missed
            </Button>
            <Button onClick={() => handleAnswer(true)} size="lg" className="flex-1 gap-2">
              <Check className="h-5 w-5" />
              Got It
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
