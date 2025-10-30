"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { UploadIcon, FileText, ClipboardPaste } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getStacks, getDecksForStack, createDeck, createCards } from "@/lib/api"
import type { Deck, Flashcard, Stack } from "@/lib/types"
import { ManualEntryForm } from "./manual-entry-form"

interface UploadProps {
  onUploadComplete: () => void
  selectedStackId: string
  userId: string
}

export function Upload({ onUploadComplete, selectedStackId, userId }: UploadProps) {
  const [deckName, setDeckName] = useState("")
  const [stackId, setStackId] = useState(selectedStackId || "general")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState("")
  const [error, setError] = useState("")
  const [stacks, setStacks] = useState<Stack[]>([])
  const [activeTab, setActiveTab] = useState("paste")
  const [mode, setMode] = useState<"new" | "existing">("new")
  const [selectedDeckId, setSelectedDeckId] = useState("")
  const [existingDecks, setExistingDecks] = useState<Deck[]>([])


  useEffect(() => {
    const loadStacks = async () => {
      const loadedStacks = await getStacks(userId)
      setStacks(loadedStacks)
    }
    loadStacks()
  }, [userId])

  useEffect(() => {
    const loadExistingDecks = async () => {
      if (stackId && mode === "existing") {
        const decks = await getDecksForStack(stackId, userId)
        setExistingDecks(decks)
        setSelectedDeckId("")
      }
    }
    loadExistingDecks()
  }, [stackId, mode, userId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError("")
    } else {
      setFile(null)
      setError("Please select a valid CSV file")
    }
  }

  const parseCSV = (text: string): Flashcard[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const cards: Flashcard[] = []

    const startIndex = lines[0].toLowerCase().includes("front") || lines[0].toLowerCase().includes("question") ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
      if (parts && parts.length >= 2) {
        const front = parts[0].replace(/^"|"$/g, "").trim()
        const back = parts[1].replace(/^"|"$/g, "").trim()

        if (front && back) {
          cards.push({
            id: `${Date.now()}-${i}`,
            front,
            back,
            missed: false,
          })
        }
      }
    }

    return cards
  }

  const handleUpload = async () => {
    if (mode === "new" && !deckName.trim()) {
      setError("Please provide a deck name")
      return
    }

    if (mode === "existing" && !selectedDeckId) {
      setError("Please select an existing deck")
      return
    }
  
    if (!file && !pastedText.trim()) {
      setError("Please provide CSV data via file upload or paste")
      return
    }
  
    try {
      const text = file ? await file.text() : pastedText
      const cards = parseCSV(text)
  
      if (cards.length === 0) {
        setError("No valid flashcards found in CSV. Expected format: front,back")
        return
      }
  
      let deckId: string
      
      if (mode === "new") {
        // Create new deck
        const newDeck = await createDeck(stackId, deckName.trim(), userId)
        deckId = newDeck.$id
      } else {
        // Use existing deck
        deckId = selectedDeckId
        
        // Get existing cards to determine next order number
        const existingDeck = existingDecks.find(d => d.id === selectedDeckId)
        if (existingDeck && existingDeck.cards.length > 0) {
          const maxOrder = Math.max(...existingDeck.cards.map((_, index) => index))
          cards.forEach((card, index) => {
            card.id = `${Date.now()}-${maxOrder + 1 + index}`
          })
        }
      }
      
      // Add all cards to the deck
      await createCards(deckId, cards, userId)
  
      // Reset form
      setDeckName("")
      setDescription("")
      setFile(null)
      setPastedText("")
      setSelectedDeckId("")
      setError("")
      onUploadComplete()
  
      // Clear file input
      const fileInput = document.getElementById("csv-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err) {
      console.error("Failed to save deck:", err)
      setError("Failed to save deck. Please try again.")
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Add Flashcards</CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload a CSV file or paste CSV data with two columns: front (question) and back (answer)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-foreground text-sm font-medium">
            Choose Option
          </Label>
          <RadioGroup value={mode} onValueChange={(value: "new" | "existing") => setMode(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="text-foreground">Create New Deck</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="text-foreground">Add to Existing Deck</Label>
            </div>
          </RadioGroup>
        </div>

        {mode === "new" && (
          <div className="space-y-2">
            <Label htmlFor="deck-name" className="text-foreground">
              Deck Name
            </Label>
            <Input
              id="deck-name"
              placeholder="e.g., Spanish Vocabulary"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>
        )}

        {mode === "existing" && (
          <div className="space-y-2">
            <Label htmlFor="existing-deck" className="text-foreground">
              Select Existing Deck
            </Label>
            <Select value={selectedDeckId} onValueChange={setSelectedDeckId}>
              <SelectTrigger id="existing-deck" className="bg-background text-foreground">
                <SelectValue placeholder="Select a deck to add cards to" />
              </SelectTrigger>
              <SelectContent>
                {existingDecks.map((deck) => (
                  <SelectItem key={deck.id} value={deck.id}>
                    {deck.title} ({deck.cards.length} cards)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {mode === "new" && (
          <div className="space-y-2">
            <Label htmlFor="deck-description" className="text-foreground">
              Description (optional)
            </Label>
            <Textarea
              id="deck-description"
              placeholder="Enter a description for your deck..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background text-foreground min-h-[80px]"
            />
          </div>
        )}

        {/* <div className="space-y-2">
          <Label htmlFor="stack-select" className="text-foreground">
            Stack
          </Label>
          <Select value={stackId} onValueChange={setStackId}>
            <SelectTrigger id="stack-select" className="bg-background text-foreground">
              <SelectValue placeholder="Select a stack" />
            </SelectTrigger>
            <SelectContent>
              {stacks.map((stack) => (
                <SelectItem key={stack.id} value={stack.id}>
                  {stack.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paste">Paste CSV</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          {/* Upload File */}
          <TabsContent value="upload" className="space-y-2">
            <Label htmlFor="csv-file" className="text-foreground">
              CSV File
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="bg-background text-foreground"
              />
              {file && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Paste CSV */}
          <TabsContent value="paste" className="space-y-2">
            <Label htmlFor="csv-paste" className="text-foreground">
              CSV Data
            </Label>
            <Textarea
              id="csv-paste"
              placeholder="Paste your CSV data here...&#10;Example:&#10;What is 2+2?,4&#10;Capital of France?,Paris"
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value)
                setError("")
              }}
              className="bg-background text-foreground min-h-[150px] font-mono text-sm"
            />
          </TabsContent>

          {/* Manual Entry */}
          <TabsContent value="manual" className="space-y-4">
            <ManualEntryForm
              mode={mode}
              onChangeError={setError}
              onSubmit={async (cards) => {
                if (mode === "new" && !deckName.trim()) {
                  setError("Please provide a deck name")
                  return
                }

                if (mode === "existing" && !selectedDeckId) {
                  setError("Please select an existing deck")
                  return
                }

                let deckId: string
                
                if (mode === "new") {
                  const newDeck = await createDeck(stackId, deckName.trim(), userId)
                  deckId = newDeck.$id
                } else {
                  deckId = selectedDeckId
                }

                await createCards(deckId, cards, userId)

                setDeckName("")
                setDescription("")
                setSelectedDeckId("")
                setError("")
                onUploadComplete()
              }}
              deckName={deckName}
              onDeckNameChange={setDeckName}
            />
          </TabsContent>
        </Tabs>



        {error && <p className="text-sm text-destructive">{error}</p>}
        {activeTab !== "manual" && (
          <Button
            onClick={handleUpload}
            disabled={
              (mode === "new" && !deckName.trim()) ||
              (mode === "existing" && !selectedDeckId) ||
              (!file && !pastedText.trim())
            }
            className="w-full"
          >
            {file || pastedText ? (
              <UploadIcon className="mr-2 h-4 w-4" />
            ) : (
              <ClipboardPaste className="mr-2 h-4 w-4" />
            )}
            {mode === "new" ? "Create Deck" : "Add Cards"}
          </Button>
        )}

      </CardContent>
    </Card>
  )
}
