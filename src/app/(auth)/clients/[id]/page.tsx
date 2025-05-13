'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, deleteClient } from '@/lib/clientService';
import { Client, ClientDocument, ClientLink, ClientNote } from '@/types';
import Link from 'next/link';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentList from '@/components/DocumentList';
import LinkForm from '@/components/LinkForm';
import LinkList from '@/components/LinkList';
import NoteForm from '@/components/NoteForm';
import NoteList from '@/components/NoteList';
import { getClientDocuments } from '@/lib/documentService';
import { getClientLinks } from '@/lib/linkService';
import { getClientNotes } from '@/lib/noteService';
import { useAuth } from '@/context/AuthContext';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [links, setLinks] = useState<ClientLink[]>([]);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [noteError, setNoteError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = params;
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData = await getClient(id);
        if (clientData) {
          setClient(clientData);
          
          // Hämta dokument
          const clientDocuments = await getClientDocuments(id);
          setDocuments(clientDocuments);
          
          // Hämta länkar
          const clientLinks = await getClientLinks(id);
          setLinks(clientLinks);
          
          // Hämta notat
          const clientNotes = await getClientNotes(id);
          setNotes(clientNotes);
        } else {
          setError('Klienten kunde inte hittas');
        }
      } catch (err) {
        console.error('Fel vid hämtning av klient:', err);
        setError('Kunde inte hämta klientens information');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(id);
      router.push('/clients');
    } catch (err) {
      console.error('Fel vid borttagning av klient:', err);
      setError('Kunde inte ta bort klienten');
      setIsDeleting(false);
    }
  };

  const handleDocumentUploadComplete = (document: ClientDocument) => {
    setDocuments(prevDocuments => [...prevDocuments, document]);
    setDocumentError(null);
  };

  const handleDocumentUploadError = (error: Error) => {
    setDocumentError(error.message);
  };

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== documentId));
  };
  
  const handleLinkAdded = (link: ClientLink) => {
    setLinks(prevLinks => [...prevLinks, link]);
    setLinkError(null);
  };
  
  const handleLinkError = (error: Error) => {
    setLinkError(error.message);
  };
  
  const handleLinkDeleted = (linkId: string) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
  };
  
  const handleNoteAdded = (note: ClientNote) => {
    setNotes(prevNotes => [note, ...prevNotes]); // Lägg till nya notat överst
    setNoteError(null);
  };
  
  const handleNoteError = (error: Error) => {
    setNoteError(error.message);
  };
  
  const handleNoteDeleted = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };

  // Formatera datum för visning
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  if (loading || !user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-gray-600">Laddar klientinformation...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
        <div className="text-red-600">{error || 'Klienten kunde inte hittas'}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-600">Klientinformation</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={`/clients/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Redigera
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Ta bort
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Klientinformation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Namn</h3>
              <p className="mt-1 text-gray-900">{client.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Startdatum</h3>
              <p className="mt-1 text-gray-900">{formatDate(client.startDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.interventionStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                  client.interventionStatus === 'Canceled' ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {client.interventionStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Bokade tider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nästa läkartid</h3>
              <p className="mt-1 text-gray-900">{formatDate(client.nextDoctorAppointment)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nästa korta kontakt</h3>
              <p className="mt-1 text-gray-900">{formatDate(client.nextShortContact)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nästa långa samtal</h3>
              <p className="mt-1 text-gray-900">{formatDate(client.nextLongConversation)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nästa test</h3>
              <p className="mt-1 text-gray-900">{formatDate(client.nextTest)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nästa möte + Rapport</h3>
              <p className="mt-1 text-gray-900">{formatDate(client.nextMeeting)}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Notat</h2>
          <NoteForm 
            clientId={id} 
            user={user}
            onNoteAdded={handleNoteAdded} 
            onError={handleNoteError} 
          />
          {noteError && (
            <div className="mt-2 text-sm text-red-600">
              {noteError}
            </div>
          )}
          <div className="mt-6">
            <NoteList 
              clientId={id}
              notes={notes} 
              currentUser={user}
              onNoteDeleted={handleNoteDeleted} 
            />
          </div>
        </div>
        
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Länkar</h2>
          <LinkForm 
            clientId={id} 
            onLinkAdded={handleLinkAdded} 
            onError={handleLinkError} 
          />
          {linkError && (
            <div className="mt-2 text-sm text-red-600">
              {linkError}
            </div>
          )}
          <div className="mt-4">
            <LinkList 
              clientId={id}
              links={links} 
              onLinkDeleted={handleLinkDeleted} 
            />
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Dokument (EJ Aktiverat ännu)</h2>
          <DocumentUpload 
            clientId={id} 
            onUploadComplete={handleDocumentUploadComplete} 
            onUploadError={handleDocumentUploadError} 
          />
          {documentError && (
            <div className="mt-2 text-sm text-red-600">
              {documentError}
            </div>
          )}
          <div className="mt-4">
            <DocumentList 
              clientId={id}
              documents={documents} 
              onDocumentDeleted={handleDocumentDeleted} 
            />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Kommentarer</h2>
          <p className="text-gray-900 whitespace-pre-line">
            {client.comments || 'Inga kommentarer'}
          </p>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="bg-white rounded-lg p-6 max-w-md w-full z-10 relative">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ta bort klient</h3>
            <p className="text-gray-600 mb-6">
              Är du säker på att du vill ta bort klienten {client.name}? Denna åtgärd kan inte ångras.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? 'Tar bort...' : 'Ta bort'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 