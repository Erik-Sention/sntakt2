'use client';

import { useState, useEffect } from 'react';
import { fetchClients } from '@/lib/clientService';
import { Client } from '@/types';
import ClientCalendar from '@/components/clients/ClientCalendar';
import { useSearchParams } from 'next/navigation';

export default function CalendarPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const clientIdParam = searchParams.get('clientId');
  const appointmentTypeParam = searchParams.get('appointmentType');

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

  // Hämta datum från URL-parameter om det finns
  const getInitialDate = () => {
    if (dateParam) {
      try {
        return new Date(dateParam);
      } catch (e) {
        console.error('Felaktigt datumformat i URL:', e);
      }
    }
    return new Date(); // Använd aktuellt datum som standard
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div>
          <h1 className="text-3xl font-light text-luxury-dark mb-2">Kalender</h1>
          <p className="text-luxury-mid text-lg">Planera och hantera alla dina bokade tider</p>
        </div>
        
        <div className="flex space-x-2 self-start">
          <button 
            onClick={() => setView('month')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'month' 
                ? 'bg-luxury-gold/20 text-luxury-dark shadow-inner-luxury'
                : 'bg-white/40 text-luxury-mid hover:bg-luxury-sand/30'
            }`}
          >
            Månad
          </button>
          <button 
            onClick={() => setView('week')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'week'
                ? 'bg-luxury-gold/20 text-luxury-dark shadow-inner-luxury'
                : 'bg-white/40 text-luxury-mid hover:bg-luxury-sand/30'
            }`}
          >
            Vecka
          </button>
        </div>
      </div>

      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="p-4 text-luxury-mid">Laddar kalender...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="calendar-container">
            <ClientCalendar 
              clients={clients} 
              initialDate={getInitialDate()}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="luxury-card">
          <h3 className="text-lg font-medium text-luxury-dark mb-4">Händelser denna månad</h3>
          <div className="text-3xl font-light text-luxury-dark mb-1">{clients.length}</div>
          <p className="text-luxury-mid">Bokade möten</p>
        </div>
        
        <div className="luxury-card md:col-span-2">
          <h3 className="text-lg font-medium text-luxury-dark mb-4">Snabbtips</h3>
          <p className="text-luxury-mid mb-3">Klicka på en dag för att se bokade tider. Klicka på en klient för att se detaljerad information.</p>
          <button className="luxury-button flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Lägg till ny händelse
          </button>
        </div>
      </div>
    </div>
  );
} 