import { useState } from 'react';
import { ClientLink } from '@/types';
import { deleteClientLink } from '@/lib/linkService';

interface LinkListProps {
  clientId: string;
  links: ClientLink[];
  onLinkDeleted: (linkId: string) => void;
}

export default function LinkList({ clientId, links, onLinkDeleted }: LinkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (linkId: string) => {
    try {
      setDeletingId(linkId);
      await deleteClientLink(clientId, linkId);
      onLinkDeleted(linkId);
    } catch (error) {
      console.error('Fel vid borttagning av länk:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  if (!links.length) {
    return (
      <div className="text-gray-500 text-sm italic">
        Inga länkar tillagda
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div 
          key={link.id} 
          className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-blue-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline truncate"
              >
                {link.name}
              </a>
              <div className="flex text-xs text-gray-500 space-x-4">
                {link.date && (
                  <span>Datum: {formatDate(link.date)}</span>
                )}
                <span>Tillagd: {formatDate(link.addedAt)}</span>
              </div>
            </div>
          </div>
          <div className="ml-2 flex-shrink-0">
            <button
              onClick={() => handleDelete(link.id)}
              disabled={deletingId === link.id}
              className="text-gray-500 hover:text-red-500 focus:outline-none disabled:opacity-50"
            >
              {deletingId === link.id ? (
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
          </div>
        </div>
      ))}
    </div>
  );
} 