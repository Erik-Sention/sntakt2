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
          <h1 className="text-3xl font-bold text-white text-glow mb-1">Klienter</h1>
          <p className="text-blue-200">Hantera dina klienter och deras kontakter</p>
        </div>
        <div className="flex items-center space-x-4">
          <ViewToggle activeView={viewMode} onViewChange={setViewMode} />
          <Link
            href="/clients/new"
            className="relative group inline-flex items-center px-4 py-2 rounded-md overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-0 group-hover:blur-sm bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-70 transition-opacity"></span>
            <span className="relative z-10 text-sm font-medium text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ny klient
            </span>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative rounded-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 py-3 px-4 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
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
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-center items-center h-[400px]">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-blue-400/30"></div>
          </div>
          <div className="mt-4 text-blue-300">Laddar klienter...</div>
        </div>
      ) : error ? (
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-center items-center h-[400px]">
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
      ) : filteredClients.length === 0 ? (
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-center items-center h-[400px] text-center p-6">
          <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Inga klienter hittades</h3>
          <p className="text-blue-200 mb-6">Lägg till en ny klient för att komma igång.</p>
          <Link 
            href="/clients/new"
            className="relative group inline-flex items-center px-4 py-2 rounded-md overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-0 group-hover:blur-sm bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-70 transition-opacity"></span>
            <span className="relative z-10 text-sm font-medium text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Lägg till klient
            </span>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl p-5">
          <ClientGrid clients={filteredClients} />
        </div>
      ) : (
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl p-5">
          <ClientCalendar clients={filteredClients} />
        </div>
      )}
    </div>
  );
} 