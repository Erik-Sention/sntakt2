'use client';

import { app, database } from './firebase';
import { ref, get } from 'firebase/database';

// En funktion för att testa om Firebase-anslutningen fungerar
export const testFirebaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  config?: Record<string, string | undefined>;
}> => {
  try {
    // Kontrollera om Firebase är initierad korrekt
    if (!app) {
      return {
        success: false,
        message: 'Firebase-appen är inte initierad',
        config: getRedactedConfig(),
      };
    }

    // Kontrollera om databasen är tillgänglig
    if (!database) {
      return {
        success: false,
        message: 'Firebase-databasen är inte tillgänglig',
        config: getRedactedConfig(),
      };
    }

    // Försök hämta alla klienter
    const clientsRef = ref(database, 'clients');
    const snapshot = await get(clientsRef);
    
    return {
      success: true,
      message: `Anslutningen lyckades. Data finns: ${snapshot.exists()}. Antal barn: ${
        snapshot.exists() ? Object.keys(snapshot.val()).length : 0
      }`,
      config: getRedactedConfig(),
    };
  } catch (error) {
    console.error('Error testing Firebase connection:', error);
    return {
      success: false,
      message: `Fel vid test av Firebase-anslutning: ${(error as Error).message}`,
      config: getRedactedConfig(),
    };
  }
};

// Funktion för att hämta konfigurationen utan att visa fullständiga nycklar
const getRedactedConfig = (): Record<string, string | undefined> => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 5) + '...',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.substring(0, 5) + '...',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.substring(0, 5) + '...',
  };
}; 