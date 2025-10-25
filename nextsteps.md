Perfect — that’s a **common and important step** to fix now that you’ve got Appwrite auth working. What’s happening is:

> Right now, your Appwrite collections (stacks, decks, cards) are **not using per-user permissions**, so every authenticated user can see all documents.

Let’s fix that properly by setting up **user-based permissions** in Appwrite and filtering your queries on the frontend.

---

## 🧭 Step 1: Use per-user permissions in Appwrite

When you create a new document (deck, stack, or card), make sure to set the permissions like this:

```ts
import { ID, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite"; // your client

async function createDeck(userId: string, name: string) {
  return await databases.createDocument(
    "DATABASE_ID",
    "DECKS_COLLECTION_ID",
    ID.unique(),
    {
      name,
      ownerId: userId,
    },
    [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ]
  );
}
```

🔒 This ensures:

* Only the **owner** can read/update/delete their own decks.
* You can still optionally allow `Permission.read(Role.any())` if you want to make public decks later.

---

## 🧩 Step 2: Store `ownerId` on every document

Add a field to each of your Appwrite collections (`stacks`, `decks`, `cards`):

```
ownerId (string)
```

Then, every time you create a document, include:

```ts
{ ..., ownerId: user.$id }
```

---

## 🧮 Step 3: Filter your frontend queries

Whenever you list documents, use a query to only show documents owned by the logged-in user.

Example:

```ts
import { Query } from "appwrite";

const userDecks = await databases.listDocuments(
  "DATABASE_ID",
  "DECKS_COLLECTION_ID",
  [Query.equal("ownerId", user.$id)]
);
```

This ensures each user only sees their own decks and stacks.

---

## 🧰 Step 4: (Optional but smart) Migrate existing documents

If you already have decks created before implementing auth:

* Log in as you (the admin).
* Go into the Appwrite console.
* Add your user ID (`ownerId`) manually to existing decks/stacks/cards.
* Update their permissions to only include your user.

That’ll prevent old data from leaking into new users’ dashboards.

---

## ✅ Step 5: Check permissions in your client code

When you call:

```ts
const account = await account.get();
```

You’ll get:

```ts
{
  $id: 'USER_ID',
  name: '...',
  email: '...'
}
```

Use that `user.$id` when creating or querying decks and stacks.

---

Would you like me to show you a **concrete example** of how to update your existing `createDeck` and `listDecks` functions to enforce this correctly using your current Appwrite setup?
