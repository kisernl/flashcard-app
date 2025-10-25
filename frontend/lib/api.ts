// /lib/api.ts
import { databases} from "./appwrite";
import { ID, Permission, Role, Models, Query } from "appwrite";
import { Stack, Deck, Flashcard } from "./types";



interface DeckDocument extends Models.Document {
    stackId?: string;
    title?: string;
    cards?: Flashcard[];
    createdAt?: number;
  }

interface CardDocument extends Models.Document {
    decks: string;
    front: string;
    back: string;
    order: number;
    missed?: boolean;
  }

  interface CreateCardData {
    decks: string;
    front: string;
    back: string;
    order: number;
    missed?: boolean;
    ownerId: string;
  }

interface StackDocument extends Models.Document {
    name?: string;
    ownerId: string;
}

// Get all stacks
export async function getStacks(userId: string): Promise<Stack[]> {
  const res: Models.DocumentList = await databases.listDocuments({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    collectionId: "stacks",
    queries: [Query.equal("ownerId", userId)]
  });
  
  return res.documents.map(doc => ({
    id: doc.$id,
    name: doc.name || 'Unnamed Stack',
    createdAt: new Date(doc.$createdAt).getTime()
  }));
}

// Get all decks in a specific stack
// export async function getDecksForStack(stackId: string): Promise<Deck[]> {
//   const res: Models.DocumentList = await databases.listDocuments({
//     databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
//     collectionId: "decks",
//     queries: [Query.equal("stacks", stackId)]
//   });
  
//   return res.documents.map(doc => ({
//     id: doc.$id,
//     title: doc.title || 'Unnamed Deck',
//     stackId: doc.stacks,
//     createdAt: new Date(doc.$createdAt).getTime(),
//     cards: []
//   }));
// }

export async function getDecksForStack(stackId: string, userId: string): Promise<Deck[]> {
    // First get all decks for this stack
    const decksRes = await databases.listDocuments({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId: "decks",
      queries: [
        Query.equal("stacks", stackId), 
        Query.equal("ownerId", userId)
      ]
    });
  
    // For each deck, get its cards
    const decksWithCards = await Promise.all(
      decksRes.documents.map(async (doc) => {
        const cards = await getCardsForDeck(doc.$id, userId);
        return {
          id: doc.$id,
          title: doc.title || 'Unnamed Deck',
          stackId: doc.stacks,
          createdAt: new Date(doc.$createdAt).getTime(),
          cards: cards.map(card => ({
            id: card.$id,
            front: card.front,
            back: card.back,
            missed: card.missed || false
          }))
        };
      })
    );
  
    return decksWithCards;
  }

// Get all cards in a specific deck, sorted by 'order'
// export async function getCardsForDeck(deckId: string): Promise<Models.Document[]> {
//   const res: Models.DocumentList = await databases.listDocuments({
//     databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
//     collectionId: "cards",
//     queries: [
//       Query.equal("decks", deckId),
//       Query.orderAsc("order")
//     ]
//   });
//   return res.documents;
// }

// Get all cards in a specific deck, sorted by 'order'
export async function getCardsForDeck(deckId: string, userId: string): Promise<Array<CardDocument & Models.Document>> {
    const res = await databases.listDocuments<CardDocument & Models.Document>({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        collectionId: "cards",
        queries: [
            Query.equal("decks", deckId),
            Query.equal("ownerId", userId),
            Query.orderAsc("order"),
            Query.limit(500),
        ],
    });
    return res.documents;
}

// Create a new deck in a stack
export async function createDeck(stackId: string, name: string, userId: string): Promise<Models.Document> {
    const deckData = {
      stacks: stackId,
      title: name,
      ownerId: userId,
    };
  
    return await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      "decks",
      ID.unique(),
      deckData,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  }


  
// Then update the createCards function
export async function createCards(deckId: string, cards: { front: string; back: string }[], userId: string): Promise<CardDocument[]> {
    const createdCards: CardDocument[] = [];
  
    for (let i = 0; i < cards.length; i++) {
      const cardData: CreateCardData = {
        decks: deckId,
        front: cards[i].front,
        back: cards[i].back,
        order: i,
        ownerId: userId,
      };
  
      const card = await databases.createDocument<CardDocument>({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        collectionId: "cards",
        documentId: ID.unique(),
        data: cardData,
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId))
        ]
      });
      createdCards.push(card);
    }
  
    return createdCards;
  }
// Create a new stack
export async function createStack(name: string, userId: string): Promise<Models.Document> {
    const stackData: Omit<StackDocument, keyof Models.Document> = { 
      name,
      ownerId: userId,
     };
    return await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      "stacks",
      ID.unique(),
      stackData,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  }
  
// Update a stack
export async function updateStack(stackId: string, updates: { name?: string }): Promise<Models.Document> {
return await databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    "stacks",
    stackId,
    updates
);
}

// Delete a stack
export async function deleteStack(stackId: string, userId: string): Promise<void> {
// First, delete all decks in this stack
const decks = await getDecksForStack(stackId, userId);
for (const deck of decks) {
    await deleteDeck(deck.id, userId);
}

// Then delete the stack itself
await databases.deleteDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    "stacks",
    stackId
);
}

// Helper function to delete a deck and its cards
export async function deleteDeck(deckId: string, userId: string): Promise<void> {
// First delete all cards in this deck
console.log("Deleting deck:", deckId);

const cards = await getCardsForDeck(deckId, userId);
for (const card of cards) {
    await databases.deleteDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    "cards",
    card.$id
    );
}

// Then delete the deck
await databases.deleteDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    "decks",
    deckId
);
}

// In api.ts
export async function resetDeck(deckId: string, userId: string): Promise<void> {
    // Get all cards for the deck
    const cards = await getCardsForDeck(deckId, userId);
    
    // Reset each card's missed status
    for (const card of cards) {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        "cards",
        card.$id,
        {
          missed: false
        }
      );
    }
  }


// In api.ts
export async function saveDeck(deck: Deck): Promise<Models.Document> {
    try {
      const data = {
        title: deck.title,
        stackId: deck.stackId,
        // Add any other fields that need to be saved
      };
  
      if (deck.id) {
        // Update existing deck
        return await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          "decks",
          deck.id,
          data
        );
      } else {
        // Create new deck
        return await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          "decks",
          "unique()",
          data
        );
      }
    } catch (error) {
      console.error("Error saving deck to Appwrite:", error);
      throw error;
    }
  }