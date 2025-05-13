# Sntakt - Klienthanteringssystem

Ett modernt klienthanteringssystem byggt med Next.js, Firebase och Tailwind CSS.

## Funktioner

- Hantera klienter och deras kontaktuppgifter
- Spåra bokade tider och möten
- Visa klienter i både lista och kalendervy
- Användarautentisering med Firebase Auth
- Datalagring med Firebase Realtime Database
- Responsiv design som fungerar på alla enheter

## Installation

1. Klona detta repository
2. Installera beroenden:

```bash
npm install
```

3. Skapa en `.env.local` fil i rotkatalogen och fyll i dina Firebase-uppgifter:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Starta utvecklingsmiljön:

```bash
npm run dev
```

5. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Deployment på Vercel

1. Skapa ett konto på [Vercel](https://vercel.com) om du inte redan har ett.
2. Koppla ditt GitHub-konto till Vercel.
3. Importera ditt projekt.
4. Lägg till ovanstående miljövariabler i Vercel-projektets inställningar.
5. Klicka på "Deploy" för att publicera din app.

## Firebase-konfiguration

1. Skapa ett nytt projekt i [Firebase Console](https://console.firebase.google.com/).
2. Aktivera Authentication och Realtime Database.
3. I Authentication, aktivera e-post/lösenord-inloggning.
4. I Realtime Database, skapa en ny databas och starta i testläge eller konfigurera regler efter dina behov.
5. Registrera en ny webbapp i ditt Firebase-projekt för att få de nödvändiga konfigurationsuppgifterna.

## Licensiering

Detta projekt är licensierat under MIT-licensen - se LICENSE-filen för mer information.
