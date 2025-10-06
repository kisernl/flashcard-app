# Flashcard Study App

A minimalist flashcard application with CSV import and deck management, and progress tracking.

## Features

- **CSV Import**: Upload (or copy and paste) CSV files to create flashcard decks
- **Deck Management**: Organize flashcards into named decks
- **Stack Management**: Organize decks into named stacks
- **Study Mode**: Interactive flashcard review with flip animations
- **Progress Tracking**: Mark cards as correct or missed
- **Filtered Study**: Review only missed cards
- **Reset Progress**: Clear missed markers to start fresh
- **Dark Mode**: Toggle between light and dark themes

## CSV Format

Your CSV file should have two columns:

\`\`\`csv
front,back
What is the capital of France?,Paris
What is 2 + 2?,4
\`\`\`

The first row can optionally be a header (it will be skipped if it contains "front", "question", or similar terms).

## Usage

1. **Create a Deck**: Enter a deck name and upload a CSV file
2. **Study Cards**: Click "Study All Cards" to review the entire deck
3. **Review Mistakes**: Click "Study Missed" to focus on cards you got wrong
4. **Track Progress**: Mark each card as "Got It" or "Missed" during study
5. **Reset Deck**: Clear all progress markers to start over
6. **Toggle Theme**: Use the sun/moon icon to switch between light and dark modes

## Data Storage & Authentication in Appwrite

All decks and progress are saved in an Appwrite database. Authentication is handled by Appwrite. You will need to create an account and login to use the app.
