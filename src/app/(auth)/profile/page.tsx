'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Ingen användare inloggad');
      }

      await updateProfile(currentUser, {
        displayName: displayName.trim()
      });

      // Tvinga en uppdatering av auth state för att reflektera den nya profilen
      window.location.reload();
      
      setUpdateSuccess(true);
    } catch (err) {
      console.error('Fel vid uppdatering av profil:', err);
      setError('Det gick inte att uppdatera profilen. Försök igen senare.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-gray-600">Laddar användarinformation...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Min profil</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Profilinformation</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-postadress
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    E-postadressen kan inte ändras
                  </p>
                </div>
                
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Ditt namn
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ange ditt namn"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Detta namn kommer att visas när du signerar notat
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-3 text-sm">
                Profilinformationen har uppdaterats!
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sparar...
                  </>
                ) : (
                  'Spara ändringar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 