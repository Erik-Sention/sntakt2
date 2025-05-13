'use client';

import { useState, useEffect } from 'react';
import { fetchClients } from '@/lib/clientService';
import { Client } from '@/types';
import ClientCalendar from '@/components/clients/ClientCalendar';

export default function CalendarPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (err) {
        console.error('Fel vid hämtning av klienter:', err);
        setError('Kunde inte hämta klienter');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow mb-1">Kalender</h1>
        <p className="text-blue-200">Visa alla bokade tider i kalendervy</p>
      </div>

      <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[400px]">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-2 border-blue-400/30"></div>
            </div>
            <div className="mt-4 text-blue-300">Laddar kalender...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-[400px]">
            <div className="h-12 w-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-red-400 text-center">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1 text-red-300/70">Kontrollera din anslutning och försök igen</p>
            </div>
          </div>
        ) : (
          <ClientCalendar clients={clients} />
        )}
      </div>
    </div>
  );
} 