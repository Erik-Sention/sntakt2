import { ref as dbRef, update, get, query, orderByChild } from 'firebase/database';
import { database } from './firebase';
import { ClientNote, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Lägg till ett nytt notat för en klient
export const addClientNote = async (
  clientId: string,
  text: string,
  author: User
): Promise<ClientNote> => {
  try {
    // Validera indata
    if (!text.trim()) {
      throw new Error('Notat kan inte vara tomt');
    }
    
    // Skapa ett unikt ID
    const noteId = uuidv4();
    
    // Använd användarnamn om det finns, annars använd e-postens första del
    const fallbackName = author.email.split('@')[0];
    
    // Skapa notat-metadata
    const clientNote: ClientNote = {
      id: noteId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      authorId: author.uid,
      authorName: author.displayName || fallbackName,
      authorEmail: author.email
    };
    
    // Spara notat i klientens data
    const clientRef = dbRef(database, `clients/${clientId}/notes/${noteId}`);
    await update(clientRef, clientNote);
    
    return clientNote;
  } catch (error) {
    console.error('Fel vid tillägg av notat:', error);
    throw error;
  }
};

// Hämta alla notat för en klient
export const getClientNotes = async (clientId: string): Promise<ClientNote[]> => {
  try {
    const clientNotesRef = dbRef(database, `clients/${clientId}/notes`);
    const snapshot = await get(clientNotesRef);
    
    if (snapshot.exists()) {
      const notes = snapshot.val();
      // Konvertera till array och sortera efter datum (senaste först)
      return Object.values(notes).map((note) => note as ClientNote)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return [];
  } catch (error) {
    console.error('Fel vid hämtning av notat:', error);
    throw error;
  }
};

// Ta bort ett notat
export const deleteClientNote = async (clientId: string, noteId: string): Promise<void> => {
  try {
    // Ta bort notat från klientdata
    const clientNoteRef = dbRef(database, `clients/${clientId}/notes/${noteId}`);
    await update(clientNoteRef, {});
  } catch (error) {
    console.error('Fel vid borttagning av notat:', error);
    throw error;
  }
}; 