import { useState } from 'react';
import { addClientNote } from '@/lib/noteService';
import { ClientNote, User } from '@/types';
import Link from 'next/link';

interface NoteFormProps {
  clientId: string;
  user: User;
  onNoteAdded: (note: ClientNote) => void;
  onError: (error: Error) => void;
}

export default function NoteForm({ clientId, user, onNoteAdded, onError }: NoteFormProps) {
  const [text, setText] = useState('');
  const [performedDate, setPerformedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format dagens datum (YYYY-MM-DD) för defaultvärde
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      onError(new Error('Notat kan inte vara tomt'));
      return;
    }

    setIsSubmitting(true);
    try {
      let performedAt;
      
      if (performedDate) {
        // Om vi har ett datum, använd det med standardtid 12:00
        performedAt = `${performedDate}T12:00:00`;
      } else {
        // Om inget datum valdes, använd aktuellt datum med standardtid 12:00
        const now = new Date();
        now.setHours(12, 0, 0, 0);
        performedAt = now.toISOString();
      }

      const newNote = await addClientNote(clientId, text, performedAt, user);
      onNoteAdded(newNote);
      
      // Rensa formuläret
      setText('');
      // Behåll datum
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Fel vid tillägg av notat'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Visa användarnamn om det finns, annars visa e-postens första del
  const displayName = user.displayName || user.email.split('@')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="noteText" className="block text-sm font-medium text-gray-700">
          Lägg till notat
        </label>
        <div className="mt-1">
          <textarea
            id="noteText"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Skriv ditt notat här..."
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="performedDate" className="block text-sm font-medium text-gray-700">
          Datum för händelsen
        </label>
        <input
          type="date"
          id="performedDate"
          value={performedDate}
          onChange={(e) => setPerformedDate(e.target.value)}
          max={today}
          className="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          Lämna tomt om händelsen skedde idag
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500 flex items-center">
          Signeras som: <span className="font-medium ml-1">{displayName}</span>
          {!user.displayName && (
            <Link 
              href="/profile" 
              className="ml-2 text-blue-500 hover:text-blue-700 hover:underline flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
              </svg>
              Ange ditt namn
            </Link>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sparar...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Lägg till notat
            </>
          )}
        </button>
      </div>
    </form>
  );
} 