# Flashcard Study App - Hacktoberfest 2025
## Appwrite hackathon submission

A modern, full-stack flashcard application built for Hacktoberfest 2025. This monorepo project features a responsive frontend, serverless backend, and seamless data persistence, all deployed on the cloud.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js, TypeScript, and Tailwind CSS
- **Serverless Backend**: Powered by Appwrite Cloud Functions
- **Real-time Sync**: Data persistence with Appwrite Database
- **CSV Import**: Upload or paste CSV files to create flashcard decks
- **Deck Management**: Organize flashcards into named decks and stacks
- **Interactive Study**: Smooth card flip and progress tracking
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Built-in theme switching

## 🛠 Tech Stack

- **Frontend**:
  - Next.js
  - TypeScript
  - Tailwind CSS

- **Backend**:
  - Appwrite Cloud Functions (Node.js)
  - Appwrite Database
  - Appwrite Authentication


## 📁 Project Structure

```
flashcard-app/
├── frontend/         # Next.js frontend application
├── functions/        # Appwrite Cloud Functions
└── README.md         # You are here!
```

## 📝 CSV Format

Your CSV file should have two columns:

```csv
front,back
What is the capital of France?,Paris
What is 2 + 2?,4
```

The first row can be a header (it will be automatically detected and skipped).

## 🚀 Getting Started

### Prerequisites

- Node.js
- pnpm
- Appwrite Cloud account

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (see `.env.example`)
4. Start the development server:
   ```bash
   pnpm dev
   ```

## 🎯 Features in Detail

- **Deck Creation**: Create multiple decks with custom names
- **Smart Study Modes**:
  - Study All: Review all cards in a deck
  - Study Missed: Focus on cards you've marked as missed
- **Progress Tracking**: Visual indicators for your learning progress
- **Responsive Interface**: Optimized for all device sizes

## 🤝 Contributing

This project was created for Hacktoberfest 2025. Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License 

## 🙏 Acknowledgments

- Built with ❤️ for Hacktoberfest 2025
- Powered by Appwrite's amazing developer tools
