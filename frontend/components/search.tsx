"use client"

import { useState, useMemo, useEffect } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDecksForStack, getStacks } from "@/lib/api"
import type { Deck, Stack } from "@/lib/types"

interface SearchProps {
  onSelectDeck: (deck: Deck) => void
}

interface CardSearchResult {
  deck: Deck
  cardIndex: number
  front: string
  back: string
}

export function Search({ onSelectDeck }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"deck" | "card">("deck")
  const [selectedStackFilter, setSelectedStackFilter] = useState<string>("all")
  const [decks, setDecks] = useState<Deck[]>([])
  const [stacks, setStacks] = useState<Stack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const [loadedDecks, loadedStacks] = await Promise.all([getDecksForStack("all"), getStacks()])
      setDecks(loadedDecks)
      setStacks(loadedStacks)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const deckResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    let filteredDecks = decks

    // Filter by stack if selected
    if (selectedStackFilter !== "all") {
      filteredDecks = filteredDecks.filter((d) => d.stackId === selectedStackFilter)
    }

    // Search deck names
    return filteredDecks.filter((deck) => deck.title.toLowerCase().includes(query))
  }, [searchQuery, selectedStackFilter, decks])

  const cardResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: CardSearchResult[] = []
    let filteredDecks = decks

    // Filter by stack if selected
    if (selectedStackFilter !== "all") {
      filteredDecks = filteredDecks.filter((d) => d.stackId === selectedStackFilter)
    }

    // Search card content
    filteredDecks.forEach((deck) => {
      deck.cards.forEach((card, index) => {
        if (card.front.toLowerCase().includes(query) || card.back.toLowerCase().includes(query)) {
          results.push({
            deck,
            cardIndex: index,
            front: card.front,
            back: card.back,
          })
        }
      })
    })

    return results
  }, [searchQuery, selectedStackFilter, decks])

  const getStackName = (stackId: string) => {
    return stacks.find((s) => s.id === stackId)?.name || "General"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Search</CardTitle>
          <CardDescription className="text-muted-foreground">
            Search for decks or cards across all stacks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchMode === "deck" ? "Search deck names..." : "Search card content..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background pl-9 text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-sm text-foreground">Search Mode</Label>
              <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "deck" | "card")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="deck">Decks</TabsTrigger>
                  <TabsTrigger value="card">Cards</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="stack-filter" className="text-sm text-foreground">
                Filter by Stack
              </Label>
              <Select value={selectedStackFilter} onValueChange={setSelectedStackFilter}>
                <SelectTrigger id="stack-filter" className="bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stacks</SelectItem>
                  {stacks.map((stack) => (
                    <SelectItem key={stack.id} value={stack.id}>
                      {stack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchQuery.trim() && (
        <div className="space-y-4">
          {searchMode === "deck" ? (
            <>
              <div className="text-sm text-muted-foreground">
                Found {deckResults.length} {deckResults.length === 1 ? "deck" : "decks"}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {deckResults.map((deck) => (
                  <Card key={deck.id} className="transition-colors hover:border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{deck.title}</CardTitle>
                      <CardDescription>
                        {getStackName(deck.stackId)} • {deck.cards.length} cards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => onSelectDeck(deck)}>
                        Study Deck
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {deckResults.length === 0 && (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No decks found matching your search</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Found {cardResults.length} {cardResults.length === 1 ? "card" : "cards"}
              </div>
              <div className="space-y-3">
                {cardResults.map((result, index) => (
                  <Card
                    key={`${result.deck.id}-${result.cardIndex}`}
                    className="transition-colors hover:border-primary/50"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <CardTitle className="text-base">{result.front}</CardTitle>
                          <CardDescription className="text-sm">{result.back}</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => onSelectDeck(result.deck)}
                        >
                          Study
                        </Button>
                      </div>
                      <div className="pt-2 text-xs text-muted-foreground">
                        {result.deck.title} • {getStackName(result.deck.stackId)}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              {cardResults.length === 0 && (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">No cards found matching your search</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
