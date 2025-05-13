import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { ref as dbRef, update, get } from 'firebase/database';
import { storage, database } from './firebase';
import { ClientDocument } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Ladda upp en PDF-fil för en klient
export const uploadClientDocument = async (
  clientId: string,
  file: File
): Promise<ClientDocument> => {
  try {
    // Skapa en unik filnamn
    const fileId = uuidv4();
    const fileName = `${fileId}-${file.name}`;
    const storagePath = `clients/${clientId}/documents/${fileName}`;
    
    // Ladda upp filen till Firebase Storage
    const storageReference = ref(storage, storagePath);
    await uploadBytes(storageReference, file);
    
    // Hämta nedladdnings-URL
    const downloadUrl = await getDownloadURL(storageReference);
    
    // Skapa dokument-metadata
    const document: ClientDocument = {
      id: fileId,
      name: file.name,
      url: downloadUrl,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
    
    // Spara dokumentreferens i klientens data
    const clientRef = dbRef(database, `clients/${clientId}/documents/${fileId}`);
    await update(clientRef, document);
    
    return document;
  } catch (error) {
    console.error('Fel vid uppladdning av dokument:', error);
    throw error;
  }
};

// Hämta alla dokument för en klient
export const getClientDocuments = async (clientId: string): Promise<ClientDocument[]> => {
  try {
    const clientDocumentsRef = dbRef(database, `clients/${clientId}/documents`);
    const snapshot = await get(clientDocumentsRef);
    
    if (snapshot.exists()) {
      const documents = snapshot.val();
      return Object.values(documents);
    }
    
    return [];
  } catch (error) {
    console.error('Fel vid hämtning av dokument:', error);
    throw error;
  }
};

// Ta bort ett dokument
export const deleteClientDocument = async (clientId: string, document: ClientDocument): Promise<void> => {
  try {
    // Ta bort filen från Firebase Storage
    const fileName = document.url.split('/').pop();
    const storagePath = `clients/${clientId}/documents/${fileName}`;
    const storageReference = ref(storage, storagePath);
    await deleteObject(storageReference);
    
    // Ta bort dokumentreferensen från klientdata
    const clientDocumentRef = dbRef(database, `clients/${clientId}/documents/${document.id}`);
    await update(clientDocumentRef, {});
  } catch (error) {
    console.error('Fel vid borttagning av dokument:', error);
    throw error;
  }
}; 