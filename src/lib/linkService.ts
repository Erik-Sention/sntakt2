import { ref as dbRef, update, get } from 'firebase/database';
import { database } from './firebase';
import { ClientLink } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Lägg till en ny länk för en klient
export const addClientLink = async (
  clientId: string,
  link: {
    name: string;
    url: string;
    date: string;
  }
): Promise<ClientLink> => {
  try {
    // Validera URL-format
    let url = link.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Skapa ett unikt ID
    const linkId = uuidv4();
    
    // Skapa länk-metadata
    const clientLink: ClientLink = {
      id: linkId,
      name: link.name,
      url: url,
      date: link.date,
      addedAt: new Date().toISOString()
    };
    
    // Spara länkreferens i klientens data
    const clientRef = dbRef(database, `clients/${clientId}/links/${linkId}`);
    await update(clientRef, clientLink);
    
    return clientLink;
  } catch (error) {
    console.error('Fel vid tillägg av länk:', error);
    throw error;
  }
};

// Hämta alla länkar för en klient
export const getClientLinks = async (clientId: string): Promise<ClientLink[]> => {
  try {
    const clientLinksRef = dbRef(database, `clients/${clientId}/links`);
    const snapshot = await get(clientLinksRef);
    
    if (snapshot.exists()) {
      const links = snapshot.val();
      return Object.values(links);
    }
    
    return [];
  } catch (error) {
    console.error('Fel vid hämtning av länkar:', error);
    throw error;
  }
};

// Ta bort en länk
export const deleteClientLink = async (clientId: string, linkId: string): Promise<void> => {
  try {
    // Ta bort länkreferensen från klientdata
    const clientLinkRef = dbRef(database, `clients/${clientId}/links/${linkId}`);
    await update(clientLinkRef, {});
  } catch (error) {
    console.error('Fel vid borttagning av länk:', error);
    throw error;
  }
}; 