import { useState } from 'react';
import { addClientLink } from '@/lib/linkService';
import { ClientLink } from '@/types';

interface LinkFormProps {
  clientId: string;
  onLinkAdded: (link: ClientLink) => void;
  onError: (error: Error) => void;
}

export default function LinkForm({ clientId, onLinkAdded, onError }: LinkFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      onError(new Error('Namn och URL måste fyllas i'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newLink = await addClientLink(clientId, { name, url, date });
      onLinkAdded(newLink);
      
      // Rensa formuläret
      setName('');
      setUrl('');
      setDate('');
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Fel vid tillägg av länk'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="linkName" className="block text-sm font-medium text-gray-700">
            Namn
          </label>
          <input
            type="text"
            id="linkName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Test resultat"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            type="text"
            id="linkUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="https://drive.google.com/..."
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="linkDate" className="block text-sm font-medium text-gray-700">
            Datum
          </label>
          <input
            type="date"
            id="linkDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Lägg till länk
            </>
          )}
        </button>
      </div>
    </form>
  );
} 