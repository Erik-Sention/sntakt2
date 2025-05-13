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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kalender</h1>
        <p className="text-gray-600">Visa alla bokade tider i kalendervy</p>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-gray-600">Laddar kalender...</div>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
          <div className="text-red-600">{error}</div>
        </div>
      ) : (
        <ClientCalendar clients={clients} />
      )}
    </div>
  );
} 