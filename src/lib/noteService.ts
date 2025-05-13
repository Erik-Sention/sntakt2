import { ref as dbRef, update, get, query, orderByChild, remove } from 'firebase/database';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { database, auth } from './firebase';
import { ClientNote, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Lägg till ett nytt notat för en klient
export const addClientNote = async (
  clientId: string,
  text: string,
  performedAt: string,
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
      performedAt: performedAt || new Date().toISOString(), // Använd angiven tid eller nuvarande tid
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
      // Konvertera till array och sortera efter performedAt-datum (senaste först)
      return Object.values(notes).map((note) => note as ClientNote)
        .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
    }
    
    return [];
  } catch (error) {
    console.error('Fel vid hämtning av notat:', error);
    throw error;
  }
};

// Ta bort ett notat
export const deleteClientNote = async (
  clientId: string, 
  noteId: string,
  userId: string
): Promise<void> => {
  try {
    // Hämta notatet först för att kontrollera ägaren
    const noteRef = dbRef(database, `clients/${clientId}/notes/${noteId}`);
    const snapshot = await get(noteRef);
    
    if (!snapshot.exists()) {
      throw new Error('Notatet hittades inte');
    }
    
    const note = snapshot.val() as ClientNote;
    
    // Kontrollera om användaren är författaren till notatet
    if (note.authorId !== userId) {
      throw new Error('Du har inte behörighet att ta bort detta notat');
    }
    
    // Ta bort notatet helt från databasen
    await remove(noteRef);
  } catch (error) {
    console.error('Fel vid borttagning av notat:', error);
    throw error;
  }
};

// Återautentisera användaren (används för känsliga operationer)
export const reauthenticateUser = async (password: string): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('Ingen inloggad användare hittades');
    }
    
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    return true;
  } catch (error) {
    console.error('Fel vid återautentisering:', error);
    throw error;
  }
}; 