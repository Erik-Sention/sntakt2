import { useState } from 'react';
import { ClientNote, User } from '@/types';
import { deleteClientNote } from '@/lib/noteService';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface NoteListProps {
  clientId: string;
  notes: ClientNote[];
  currentUser: User;
  onNoteDeleted: (noteId: string) => void;
}

export default function NoteList({ clientId, notes, currentUser, onNoteDeleted }: NoteListProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<ClientNote | null>(null);

  const handleDeleteClick = (note: ClientNote) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteClientNote(clientId, noteToDelete.id, currentUser.uid);
      onNoteDeleted(noteToDelete.id);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Fel vid borttagning av notat:', error);
      // Felhantering görs i DeleteConfirmationModal
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Formatera endast datum, utan tid
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Kolla om användaren är författaren till notatet
  const isAuthor = (note: ClientNote) => {
    return note.authorId === currentUser.uid;
  };

  if (!notes.length) {
    return (
      <div className="text-gray-500 text-sm italic">
        Inga notat tillagda
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-700">
        <p>Sorterat efter händelsedatum (nyaste först)</p>
      </div>
      <div className="space-y-4">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className="p-4 bg-white border rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{note.authorName}</span>
                <span className="text-xs text-gray-500">{note.authorEmail}</span>
              </div>
              {isAuthor(note) && (
                <button
                  onClick={() => handleDeleteClick(note)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none disabled:opacity-50"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {note.text}
              </p>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
              <span>
                <span className="font-medium">Datum:</span> {formatDate(note.performedAt)}
              </span>
              <span>
                <span className="font-medium">Skapat:</span> {formatDate(note.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {noteToDelete && (
        <DeleteConfirmationModal
          title="Ta bort notat"
          message={`Är du säker på att du vill ta bort detta notat? Denna åtgärd kan inte ångras.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isOpen={showDeleteModal}
          requireAuth={true}
        />
      )}
    </>
  );
} 