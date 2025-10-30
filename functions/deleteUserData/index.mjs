import { Client, Databases, Users, Query } from "node-appwrite";

export default async ({ req, res, log }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const users = new Users(client);

    // Get userId from the authenticated session
    const { userId } = JSON.parse(req.body || '{}');
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    log(`Starting deletion process for user: ${userId}`);

    // Define your database ID (from env variables)
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

    // 1. Delete all cards owned by user
    log("Deleting user cards...");
    let allCards = [];
    let cardsOffset = 0;
    const cardsLimit = 100;
    
    // Fetch all cards in batches to handle pagination
    while (true) {
      const cards = await databases.listDocuments(DATABASE_ID, "cards", [
        Query.equal("ownerId", userId),
        Query.limit(cardsLimit),
        Query.offset(cardsOffset)
      ]);
      
      if (cards.documents.length === 0) break;
      
      allCards.push(...cards.documents);
      cardsOffset += cardsLimit;
      
      if (cards.documents.length < cardsLimit) break;
    }

    for (const card of allCards) {
      await databases.deleteDocument(DATABASE_ID, "cards", card.$id);
    }
    log(`Deleted ${allCards.length} cards`);

    // 2. Delete all decks owned by user
    log("Deleting user decks...");
    let allDecks = [];
    let decksOffset = 0;
    const decksLimit = 100;
    
    while (true) {
      const decks = await databases.listDocuments(DATABASE_ID, "decks", [
        Query.equal("ownerId", userId),
        Query.limit(decksLimit),
        Query.offset(decksOffset)
      ]);
      
      if (decks.documents.length === 0) break;
      
      allDecks.push(...decks.documents);
      decksOffset += decksLimit;
      
      if (decks.documents.length < decksLimit) break;
    }

    for (const deck of allDecks) {
      await databases.deleteDocument(DATABASE_ID, "decks", deck.$id);
    }
    log(`Deleted ${allDecks.length} decks`);

    // 3. Delete all stacks owned by user
    log("Deleting user stacks...");
    let allStacks = [];
    let stacksOffset = 0;
    const stacksLimit = 100;
    
    while (true) {
      const stacks = await databases.listDocuments(DATABASE_ID, "stacks", [
        Query.equal("ownerId", userId),
        Query.limit(stacksLimit),
        Query.offset(stacksOffset)
      ]);
      
      if (stacks.documents.length === 0) break;
      
      allStacks.push(...stacks.documents);
      stacksOffset += stacksLimit;
      
      if (stacks.documents.length < stacksLimit) break;
    }

    for (const stack of allStacks) {
      await databases.deleteDocument(DATABASE_ID, "stacks", stack.$id);
    }
    log(`Deleted ${allStacks.length} stacks`);

    // 4. Finally delete the user account itself
    log("Deleting user account...");
    await users.delete(userId);

    log(`Successfully deleted all data for user: ${userId}`);
    
    return res.json({ 
      success: true, 
      message: "User account and all associated data deleted successfully",
      deletedCounts: {
        cards: allCards.length,
        decks: allDecks.length,
        stacks: allStacks.length
      }
    });

  } catch (err) {
    log(`Error: ${err.message}`);
    return res.json({ 
      success: false, 
      error: err.message 
    }, 500);
  }
};