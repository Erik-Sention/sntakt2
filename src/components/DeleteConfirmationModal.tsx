import React, { useState } from 'react';
import { reauthenticateUser } from '@/lib/noteService';

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  requireAuth?: boolean;
}

export default function DeleteConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  requireAuth = false
}: DeleteConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      if (requireAuth) {
        if (!password.trim()) {
          setError('Lösenord krävs för att bekräfta');
          setIsDeleting(false);
          return;
        }

        // Återautentisera användaren
        await reauthenticateUser(password);
      }

      // Utför borttagningen
      await onConfirm();
    } catch (err) {
      console.error('Fel vid borttagning:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ett fel uppstod vid borttagning');
      }
    } finally {
      setIsDeleting(false);
      // Oavsett om det lyckas eller inte, rensa lösenordet
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {requireAuth && (
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Bekräfta med ditt lösenord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ditt lösenord"
              disabled={isDeleting}
            />
            <p className="mt-1 text-xs text-gray-500">
              Detta krävs av säkerhetsskäl
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting || (requireAuth && !password)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Tar bort...
              </>
            ) : (
              'Ta bort'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 