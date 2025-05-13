import { ref, get, set, push, remove, update } from 'firebase/database';
import { database } from './firebase';
import { Client } from '@/types';

// Hämta alla klienter
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const clientsRef = ref(database, 'clients');
    const snapshot = await get(clientsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, client]) => ({
        id,
        ...client as Omit<Client, 'id'>
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Fel vid hämtning av klienter:', error);
    throw error;
  }
};

// Lägg till ny klient
export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const clientsRef = ref(database, 'clients');
    const newClientRef = push(clientsRef);
    const id = newClientRef.key as string;
    
    await set(newClientRef, client);
    
    return {
      id,
      ...client
    };
  } catch (error) {
    console.error('Fel vid tillägg av klient:', error);
    throw error;
  }
};

// Uppdatera en klient
export const updateClient = async (id: string, updates: Partial<Omit<Client, 'id'>>): Promise<void> => {
  try {
    const clientRef = ref(database, `clients/${id}`);
    await update(clientRef, updates);
  } catch (error) {
    console.error('Fel vid uppdatering av klient:', error);
    throw error;
  }
};

// Ta bort en klient
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const clientRef = ref(database, `clients/${id}`);
    await remove(clientRef);
  } catch (error) {
    console.error('Fel vid borttagning av klient:', error);
    throw error;
  }
};

// Hämta en specifik klient
export const getClient = async (id: string): Promise<Client | null> => {
  try {
    const clientRef = ref(database, `clients/${id}`);
    const snapshot = await get(clientRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        id,
        ...data
      };
    }
    
    return null;
  } catch (error) {
    console.error('Fel vid hämtning av klient:', error);
    throw error;
  }
}; 