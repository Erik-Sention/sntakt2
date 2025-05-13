'use client';

import { useState, useEffect } from 'react';
import { fetchClients } from '@/lib/clientService';
import { Client, ViewMode } from '@/types';
import Link from 'next/link';
import ClientGrid from '@/components/clients/ClientGrid';
import ViewToggle from '@/components/clients/ViewToggle';
import ClientCalendar from '@/components/clients/ClientCalendar';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filterera klienter baserat på sökterm
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.comments.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klienter</h1>
          <p className="text-gray-600">Hantera dina klienter och deras kontakter</p>
        </div>
        <div className="flex items-center space-x-4">
          <ViewToggle activeView={viewMode} onViewChange={setViewMode} />
          <Link
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ny klient
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative rounded-md shadow-sm max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 py-3 px-4 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            placeholder="Sök klienter..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-gray-600">Laddar klienter...</div>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
          <div className="text-red-600">{error}</div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-center items-center min-h-[400px] text-center">
          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Inga klienter hittades</h3>
          <p className="text-gray-600 mb-4">Lägg till en ny klient för att komma igång.</p>
          <Link 
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lägg till klient
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <ClientGrid clients={filteredClients} />
      ) : (
        <ClientCalendar clients={filteredClients} />
      )}
    </div>
  );
} 