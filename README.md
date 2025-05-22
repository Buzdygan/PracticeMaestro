# Practice Maestro

A cross-platform Progressive Web App (PWA) designed to assist piano players in managing their practice routines using spaced repetition techniques. The app helps users balance reviewing known pieces and learning new ones by generating daily practice plans based on various criteria.

## Features

- **Spaced Repetition Engine**: Uses Leitner-style system to optimize practice schedules
- **Library Management**: CRUD operations for practice items (scales, chords, fragments, pieces)
- **Daily Practice Plans**: Auto-generated based on due dates and difficulty
- **Progress Tracking**: Record practice sessions and performance metrics
- **Cross-Platform**: Works on web, iOS, and Android

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Cross-Platform**: PWA with Capacitor wrappers for iOS and Android
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **State Management**: React Query, Zustand
- **CI/CD**: GitHub Actions deploying to Firebase Hosting

## Project Structure

```
/practice-maestro
├── apps/
│   ├── web/                  # React PWA
│   └── mobile/               # Capacitor for iOS/Android
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── services/             # Business logic and utilities
│   ├── features/             # Feature modules
│   │   ├── library/          # Library management
│   │   ├── practice/         # Practice session
│   │   └── dashboard/        # Statistics and overview
│   ├── eslint-config/        # Shared ESLint config
│   └── typescript-config/    # Shared TypeScript config
```

## Getting Started

### Prerequisites

- Node.js v18 or later
- npm v10 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/practice-maestro.git
cd practice-maestro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file in the `apps/web` directory with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Development Workflow

- `npm run dev`: Start development servers for all apps
- `npm run build`: Build all apps for production
- `npm run lint`: Run ESLint on all packages
- `npm run format`: Format code with Prettier

## Mobile Development

```bash
# Install Capacitor native platforms
cd apps/mobile
npm run build  # Builds the web app
npm run sync   # Syncs web build to native projects

# Open native IDEs
npm run open:ios
npm run open:android
```

## Deployment

The project uses GitHub Actions for CI/CD:
- Pushes to `dev` branch deploy to staging
- Pushes to `main` branch deploy to production

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
