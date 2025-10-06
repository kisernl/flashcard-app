import type { Deck, Stack } from "./types"

const DB_NAME = "flashcard-db"
const DB_VERSION = 1
const DECKS_STORE = "decks"
const STACKS_STORE = "stacks"

let dbInstance: IDBDatabase | null = null

// Initialize the database
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create stacks store
      if (!db.objectStoreNames.contains(STACKS_STORE)) {
        const stackStore = db.createObjectStore(STACKS_STORE, { keyPath: "id" })
        stackStore.createIndex("name", "name", { unique: false })
      }

      // Create decks store
      if (!db.objectStoreNames.contains(DECKS_STORE)) {
        const deckStore = db.createObjectStore(DECKS_STORE, { keyPath: "id" })
        deckStore.createIndex("stackId", "stackId", { unique: false })
        deckStore.createIndex("name", "name", { unique: false })
      }
    }
  })
}

// Generic database operations
async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function get<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function put<T>(storeName: string, item: T): Promise<void> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(item)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function remove(storeName: string, id: string): Promise<void> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function getByIndex<T>(storeName: string, indexName: string, value: string): Promise<T[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Stack operations
export async function getStacks(): Promise<Stack[]> {
  const stacks = await getAll<Stack>(STACKS_STORE)

  // Ensure "General" stack always exists
  if (!stacks.find((s) => s.id === "general")) {
    const generalStack: Stack = {
      id: "general",
      name: "General",
      createdAt: Date.now(),
    }
    await put(STACKS_STORE, generalStack)
    stacks.unshift(generalStack)
  }

  return stacks
}

export async function saveStack(stack: Stack): Promise<void> {
  await put(STACKS_STORE, stack)
}

export async function deleteStack(stackId: string): Promise<void> {
  if (stackId === "general") return // Cannot delete general stack

  await remove(STACKS_STORE, stackId)

  // Move all decks from deleted stack to general
  const decks = await getDecks()
  for (const deck of decks) {
    if (deck.stackId === stackId) {
      deck.stackId = "general"
      await saveDeck(deck)
    }
  }
}

// Deck operations
export async function getDecks(): Promise<Deck[]> {
  return getAll<Deck>(DECKS_STORE)
}

export async function getDeck(deckId: string): Promise<Deck | undefined> {
  return get<Deck>(DECKS_STORE, deckId)
}

export async function saveDeck(deck: Deck): Promise<void> {
  console.log("saveDeck called with:", deck)
  try {
    await put(DECKS_STORE, deck)
    console.log("Deck saved to IndexedDB successfully")
  } catch (error) {
    console.error("Error saving deck to IndexedDB:", error)
    throw error
  }
}
export async function deleteDeck(deckId: string): Promise<void> {
  await remove(DECKS_STORE, deckId)
}

export async function getDecksByStack(stackId: string): Promise<Deck[]> {
  return getByIndex<Deck>(DECKS_STORE, "stackId", stackId)
}

// Migration from localStorage
export async function migrateFromLocalStorage(): Promise<void> {
  if (typeof window === "undefined") return

  const STORAGE_KEY = "flashcard-decks"
  const STACKS_KEY = "flashcard-stacks"

  // Check if migration is needed
  const hasLocalStorageData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STACKS_KEY)

  if (!hasLocalStorageData) return

  console.log("[v0] Migrating data from localStorage to IndexedDB...")

  // Migrate stacks
  const stacksData = localStorage.getItem(STACKS_KEY)
  if (stacksData) {
    const stacks: Stack[] = JSON.parse(stacksData)
    for (const stack of stacks) {
      await saveStack(stack)
    }
  }

  // Migrate decks
  const decksData = localStorage.getItem(STORAGE_KEY)
  if (decksData) {
    const decks: Deck[] = JSON.parse(decksData)
    for (const deck of decks) {
      await saveDeck(deck)
    }
  }

  // Clear localStorage after successful migration
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STACKS_KEY)

  console.log("[v0] Migration complete!")
}
