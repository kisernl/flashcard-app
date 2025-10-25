"use client"

import { BookOpen, Trash2, RotateCcw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteDeck, getCardsForDeck, resetDeck } from "@/lib/api"
import { databases } from "@/lib/appwrite"
import type { Deck } from "@/lib/types"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeckListProps {
  decks: Deck[]
  onSelectDeck: (deck: Deck, missedOnly?: boolean) => void
  onDeckDeleted: () => void
  onResetDeck: (deckId: string) => Promise<void>
  userId: string
}

export function DeckList({ decks, onSelectDeck, onDeckDeleted, onResetDeck, userId }: DeckListProps) {
  const [resettingDeckId, setResettingDeckId] = useState<string | null>(null)
  const [deletingDeckId, setDeletingDeckId] = useState<string | null>(null)

  const handleDelete = async (deckId: string, userId: string) => {
    try {
      setDeletingDeckId(deckId)
      await deleteDeck(deckId, userId)
      onDeckDeleted()
    } catch (error) {
      console.error("Failed to delete deck:", error)
    } finally {
      setDeletingDeckId(null)
    }
  }

  // const handleReset = async (deckId: string) => {
  //   try {
  //     // Get all cards for the deck
  //     const cards = await getCardsForDeck(deckId)
      
  //     // Reset each card's review data
  //     const updates = cards.map(card => 
  //       databases.updateDocument(
  //         process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  //         "cards",
  //         card.$id,
  //         {
  //           lastReviewed: null,
  //           nextReview: null,
  //           interval: 1,
  //           easeFactor: 2.5,
  //           reviewCount: 0
  //         }
  //       )
  //     )
      
  //     await Promise.all(updates)
  //     onDeckDeleted() // Refresh the UI
  //   } catch (error) {
  //     console.error("Failed to reset deck:", error)
  //   }
  // }

  const handleReset = async (deckId: string) => {
    try {
      setResettingDeckId(deckId)
      await onResetDeck(deckId);
      onDeckDeleted(); // Refresh the UI
    } catch (error) {
      console.error("Failed to reset deck:", error)
    } finally {
      setResettingDeckId(null)
    }
  }

  if (decks.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">No decks yet. Upload a CSV to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Your Decks</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => {
          const missedCount = deck.cards.filter((card) => card.missed).length
          const totalCards = deck.cards.length

          return (
            <Card key={deck.id} className="border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">{deck.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {totalCards} {totalCards === 1 ? "card" : "cards"}
                  {missedCount > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {missedCount} missed
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => onSelectDeck(deck)} className="w-full" variant="default">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study All Cards
                </Button>

                {missedCount > 0 && (
                  <Button onClick={() => onSelectDeck(deck, true)} className="w-full" variant="secondary">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Study Missed ({missedCount})
                  </Button>
                )}

                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={resettingDeckId === deck.id}>
                      {resettingDeckId === deck.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="mr-2 h-4 w-4" />
                        )}
                        {resettingDeckId === deck.id ? 'Resetting...' : 'Reset'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Reset Deck Progress?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This will clear all missed card markers for &quot;{deck.title}&quot;. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleReset(deck.id)}>Reset</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Delete Deck?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This will permanently delete &quot;{deck.title}&quot; and all its cards. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(deck.id, userId)}
                          className="bg-destructive text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
