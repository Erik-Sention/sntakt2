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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Välkommen till Sntakt</h1>
        <p className="text-gray-600">Hantera dina klienter och kontakter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kommande kontakter</h2>
          
          {loading ? (
            <div className="animate-pulse text-gray-600">Laddar...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-gray-500">Inga kommande kontakter</div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((client) => (
                <div key={client.id} className="flex items-start p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium">{client.name}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Nästa läkartid: {new Date(client.nextDoctorAppointment).toLocaleDateString('sv-SE')}</p>
                      <p>Status: <span className={`${
                        client.interventionStatus === 'Completed' ? 'text-green-600' : 
                        client.interventionStatus === 'Canceled' ? 'text-red-600' : 'text-blue-600'
                      }`}>{client.interventionStatus}</span></p>
                    </div>
                  </div>
                  <div>
                    <Link 
                      href={`/clients/${client.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visa detaljer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <Link 
              href="/clients"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Visa alla klienter →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Snabbåtgärder</h2>
          <div className="space-y-3">
            <Link
              href="/clients/new"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-center text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Lägg till ny klient
            </Link>
            <Link
              href="/calendar"
              className="block w-full py-2 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-center text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Visa kalender
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 