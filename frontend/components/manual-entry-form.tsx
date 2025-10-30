import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import type { Flashcard } from "@/lib/types"

interface ManualEntryFormProps {
  onSubmit: (cards: Flashcard[]) => Promise<void>
  onChangeError?: (msg: string) => void
  mode?: "new" | "existing"
  deckName?: string
  onDeckNameChange?: (name: string) => void
}

export function ManualEntryForm({ onSubmit, onChangeError, mode = "new", deckName = "", onDeckNameChange }: ManualEntryFormProps) {
  const [cards, setCards] = useState([{ front: "", back: "" }])
  const [loading, setLoading] = useState(false)

  const addCard = () => setCards([...cards, { front: "", back: "" }])
  const removeCard = (index: number) => setCards(cards.filter((_, i) => i !== index))
  const updateCard = (index: number, field: "front" | "back", value: string) => {
    const updated = [...cards]
    updated[index][field] = value
    setCards(updated)
  }

  // ✅ Derived state: only count cards that have both sides filled
  const validCards = useMemo(
    () => cards.filter((c) => c.front.trim() && c.back.trim()),
    [cards]
  )

  const handleSubmit = async () => {
    if (validCards.length === 0) {
      onChangeError?.("Please enter at least one complete flashcard (front + back).")
      return
    }

    setLoading(true)
    const formatted: Flashcard[] = validCards.map((c, i) => ({
      id: `${Date.now()}-${i}`,
      front: c.front.trim(),
      back: c.back.trim(),
      missed: false,
    }))

    await onSubmit(formatted)
    setCards([{ front: "", back: "" }])
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <div key={index} className="grid grid-cols-2 gap-2 items-start">
          <div>
            <Label>Front</Label>
            <Input
              placeholder="Question..."
              value={card.front}
              onChange={(e) => updateCard(index, "front", e.target.value)}
              className="bg-background text-foreground mt-2"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label>Back</Label>
              <Input
                placeholder="Answer..."
                value={card.back}
                onChange={(e) => updateCard(index, "back", e.target.value)}
                className="bg-background text-foreground mt-2"
              />
            </div>
            {cards.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCard(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <Button onClick={addCard} className="w-fit bg-transparent text-primary hover:bg-transparent hover:scale-105 transition-all">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Another Card
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || validCards.length === 0 || deckName.trim() === ""}
        className="w-full"
      >
        {loading ? "Saving..." : mode === "existing" ? "Add Cards" : "Create Deck with Cards"}
      </Button>
    </div>
  )
}
