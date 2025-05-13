import { useState } from 'react';
import { ClientNote, User } from '@/types';
import { deleteClientNote } from '@/lib/noteService';

interface NoteListProps {
  clientId: string;
  notes: ClientNote[];
  currentUser: User;
  onNoteDeleted: (noteId: string) => void;
}

export default function NoteList({ clientId, notes, currentUser, onNoteDeleted }: NoteListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (noteId: string) => {
    try {
      setDeletingId(noteId);
      await deleteClientNote(clientId, noteId);
      onNoteDeleted(noteId);
    } catch (error) {
      console.error('Fel vid borttagning av notat:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                onClick={() => handleDelete(note.id)}
                disabled={deletingId === note.id}
                className="text-gray-500 hover:text-red-500 focus:outline-none disabled:opacity-50"
              >
                {deletingId === note.id ? (
                  <svg 
                    className="animate-spin h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
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
                )}
              </button>
            )}
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-900 whitespace-pre-line">
              {note.text}
            </p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {formatDate(note.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
} 