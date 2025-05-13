'use client';

import { useState, useEffect } from 'react';
import { fetchClients } from '@/lib/clientService';
import { Client } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
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

  // Sortera klienter efter nästa kontaktdatum
  const sortedClients = [...clients].sort((a, b) => {
    const dateA = new Date(a.nextDoctorAppointment);
    const dateB = new Date(b.nextDoctorAppointment);
    return dateA.getTime() - dateB.getTime();
  });

  // Hämta de 5 närmaste inbokade kontakterna
  const upcomingAppointments = sortedClients.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow mb-1">Välkommen till Sntakt</h1>
        <p className="text-blue-200">Hantera dina klienter och kontakter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-100">Kommande kontakter</h2>
            <div className="h-8 w-8 rounded-full bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-blue-400/30"></div>
                </div>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-400">{error}</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="py-4 text-center text-gray-400">Inga kommande kontakter</div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((client) => (
                  <div key={client.id} className="group relative p-3 border border-white/5 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-blue-200 transition-colors">{client.name}</h3>
                        <div className="text-sm text-gray-400">
                          <p>Nästa läkartid: <span className="text-gray-300">{new Date(client.nextDoctorAppointment).toLocaleDateString('sv-SE')}</span></p>
                          <p>Status: <span className={`${
                            client.interventionStatus === 'Completed' ? 'text-green-400' : 
                            client.interventionStatus === 'Canceled' ? 'text-red-400' : 'text-blue-400'
                          }`}>{client.interventionStatus}</span></p>
                        </div>
                      </div>
                      <div>
                        <Link 
                          href={`/clients/${client.id}`}
                          className="text-sm text-blue-400 hover:text-blue-300 group-hover:underline transition-colors"
                        >
                          Visa detaljer
                        </Link>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 text-right">
              <Link 
                href="/clients"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors group"
              >
                Visa alla klienter
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-glass backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-100">Snabbåtgärder</h2>
            <div className="h-8 w-8 rounded-full bg-blue-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <Link
              href="/clients/new"
              className="relative group flex items-center justify-center w-full py-3 px-4 overflow-hidden rounded-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-0 group-hover:blur-sm bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-70 transition-opacity"></span>
              <span className="relative z-10 text-white font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Lägg till ny klient
              </span>
            </Link>
            
            <Link
              href="/calendar"
              className="relative group flex items-center justify-center w-full py-3 px-4 overflow-hidden rounded-lg border border-white/10 bg-transparent hover:bg-white/5 transition-colors"
            >
              <span className="text-gray-300 group-hover:text-white font-medium flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Visa kalender
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 