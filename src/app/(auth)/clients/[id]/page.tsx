'use client';

import { useEffect, useState, useCallback } from 'react';
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
import AppointmentEditButton from '@/components/clients/AppointmentEditButton';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

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

  const fetchClientData = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [id]);

  useEffect(() => {
    fetchClientData();
  }, [id, fetchClientData]);

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
            {client.personnummer && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Personnummer</h3>
                <p className="mt-1 text-gray-900">{client.personnummer}</p>
              </div>
            )}
            {client.gatuadress && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Adress</h3>
                <p className="mt-1 text-gray-900">
                  {client.gatuadress}
                  {client.postnummer && client.stad && (
                    <>
                      <br />
                      {client.postnummer.length === 5 
                        ? `${client.postnummer.substring(0, 3)} ${client.postnummer.substring(3, 5)}` 
                        : client.postnummer} {client.stad}
                    </>
                  )}
                  {client.postnummer && !client.stad && (
                    <>
                      <br />
                      {client.postnummer.length === 5 
                        ? `${client.postnummer.substring(0, 3)} ${client.postnummer.substring(3, 5)}` 
                        : client.postnummer}
                    </>
                  )}
                  {!client.postnummer && client.stad && <><br />{client.stad}</>}
                </p>
              </div>
            )}
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
          <div className="space-y-6">
            {client.clinic && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Tillhör klinik</h3>
                <p className="text-gray-900">{client.clinic}</p>
              </div>
            )}
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-blue-800">Nästa läkartid</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(client.nextDoctorAppointment)}</p>
                </div>
                <AppointmentEditButton 
                  client={client} 
                  appointmentType="doctor" 
                  onUpdate={() => fetchClientData()}
                />
              </div>
              <div className="p-4 space-y-3">
                {client.doctorName && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Läkare</h4>
                    <p className="mt-1 text-gray-900">{client.doctorName}</p>
                  </div>
                )}
                {client.doctorAppointmentDetails && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Detaljer</h4>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">{client.doctorAppointmentDetails}</p>
                  </div>
                )}
                <div>
                  <button 
                    onClick={() => router.push(`/calendar?date=${client.nextDoctorAppointment}&clientId=${client.id}&appointmentType=Läkartid`)} 
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Visa i kalender
                  </button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-blue-800">Nästa korta kontakt</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(client.nextShortContact)}</p>
                </div>
                <AppointmentEditButton 
                  client={client} 
                  appointmentType="shortContact" 
                  onUpdate={() => fetchClientData()}
                />
              </div>
              <div className="p-4 space-y-3">
                {client.shortContactPerson && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Kontaktperson</h4>
                    <p className="mt-1 text-gray-900">{client.shortContactPerson}</p>
                  </div>
                )}
                {client.shortContactDetails && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Detaljer</h4>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">{client.shortContactDetails}</p>
                  </div>
                )}
                <div>
                  <button 
                    onClick={() => router.push(`/calendar?date=${client.nextShortContact}&clientId=${client.id}&appointmentType=Kort kontakt`)} 
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Visa i kalender
                  </button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-blue-800">Nästa långa samtal</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(client.nextLongConversation)}</p>
                </div>
                <AppointmentEditButton 
                  client={client} 
                  appointmentType="longConversation" 
                  onUpdate={() => fetchClientData()}
                />
              </div>
              <div className="p-4 space-y-3">
                {client.longConversationPerson && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Samtalsperson</h4>
                    <p className="mt-1 text-gray-900">{client.longConversationPerson}</p>
                  </div>
                )}
                {client.longConversationDetails && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Detaljer</h4>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">{client.longConversationDetails}</p>
                  </div>
                )}
                <div>
                  <button 
                    onClick={() => router.push(`/calendar?date=${client.nextLongConversation}&clientId=${client.id}&appointmentType=Långt samtal`)} 
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Visa i kalender
                  </button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-blue-800">Nästa test</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(client.nextTest)}</p>
                </div>
                <AppointmentEditButton 
                  client={client} 
                  appointmentType="test" 
                  onUpdate={() => fetchClientData()}
                />
              </div>
              <div className="p-4 space-y-3">
                {client.testPerson && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Testansvarig</h4>
                    <p className="mt-1 text-gray-900">{client.testPerson}</p>
                  </div>
                )}
                {client.testDetails && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Detaljer</h4>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">{client.testDetails}</p>
                  </div>
                )}
                <div>
                  <button 
                    onClick={() => router.push(`/calendar?date=${client.nextTest}&clientId=${client.id}&appointmentType=Test`)} 
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Visa i kalender
                  </button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-3 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium text-blue-800">Nästa möte + Rapport</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(client.nextMeeting)}</p>
                </div>
                <AppointmentEditButton 
                  client={client} 
                  appointmentType="meeting" 
                  onUpdate={() => fetchClientData()}
                />
              </div>
              <div className="p-4 space-y-3">
                {client.meetingPersons && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mötesdeltagare</h4>
                    <p className="mt-1 text-gray-900">{client.meetingPersons}</p>
                  </div>
                )}
                {client.meetingDetails && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Detaljer</h4>
                    <p className="mt-1 text-gray-700 whitespace-pre-line">{client.meetingDetails}</p>
                  </div>
                )}
                <div>
                  <button 
                    onClick={() => router.push(`/calendar?date=${client.nextMeeting}&clientId=${client.id}&appointmentType=Möte + Rapport`)} 
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Visa i kalender
                  </button>
                </div>
              </div>
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
        <DeleteConfirmationModal
          title="Ta bort klient"
          message={`Är du säker på att du vill ta bort klienten ${client.name}? Denna åtgärd kan inte ångras.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isOpen={showDeleteConfirm}
          requireAuth={true}
        />
      )}
    </div>
  );
} 