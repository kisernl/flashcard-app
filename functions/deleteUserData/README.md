# Delete User Data Function

This Appwrite function completely deletes a user's account and all associated data from the flashcard application.

## Function Configuration

### Environment Variables Required
- `APPWRITE_ENDPOINT`: Your Appwrite endpoint (e.g., `https://nyc.cloud.appwrite.io/v1`)
- `APPWRITE_PROJECT_ID`: Your Appwrite project ID
- `APPWRITE_DATABASE_ID`: Your Appwrite database ID  
- `APPWRITE_API_KEY`: Server API key with the following permissions:
  - Database: Read, Write, Delete
  - Users: Read, Write, Delete
  - Collections: `stacks`, `decks`, `cards`

### Function Settings
- **Name**: `deleteUserData`
- **Runtime**: `Node.js 22`
- **Entrypoint**: `index.mjs`
- **Root Directory**: `functions/deleteUserData`
- **Execute Access**: Authenticated users only

## What This Function Does

1. **Deletes Cards**: Removes all cards owned by the user (with `ownerId` matching the user ID)
2. **Deletes Decks**: Removes all decks owned by the user
3. **Deletes Stacks**: Removes all stacks owned by the user
4. **Deletes User Account**: Finally removes the user account itself

The function handles pagination automatically to ensure all data is deleted even for users with large amounts of content.

## Request Format

```json
{
  "userId": "string - The ID of the user whose data should be deleted"
}
```

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "User account and all associated data deleted successfully",
  "deletedCounts": {
    "cards": 42,
    "decks": 12,
    "stacks": 3
  }
}
```

### Error Response (500)
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Deployment Steps

1. Push this code to your GitHub repository
2. In Appwrite Console, go to Functions
3. Create a new function with the settings above
4. Set the environment variables
5. Deploy the function
6. Note the Function ID and update the frontend code with the correct function ID

## Security Notes

- This function can only be executed by authenticated users
- The function will only delete data that belongs to the authenticated user
- This operation is irreversible - all user data will be permanently deleted
- Consider implementing additional confirmation steps in your frontend