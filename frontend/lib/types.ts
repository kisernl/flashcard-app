export interface Flashcard {
  id: string
  front: string
  back: string
  missed: boolean
}

export interface Deck {
  id: string
  title: string
  createdAt: number
  cards: Flashcard[]
  stackId: string // References a stack, defaults to "general"
}

export interface Stack {
  id: string
  name: string
  description?: string
  createdAt: number
  ownerId: string
}
