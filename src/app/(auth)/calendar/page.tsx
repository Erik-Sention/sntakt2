'use client';

import { useState, useEffect } from 'react';
import { fetchClients } from '@/lib/clientService';
import { Client } from '@/types';
import ClientCalendar from '@/components/clients/ClientCalendar';

export default function CalendarPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

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

      <div className="luxury-card overflow-hidden animate-slide-in" style={{ animationDelay: '0.2s' }}>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-luxury-gold animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-2 border-luxury-rosegold/30"></div>
            </div>
            <div className="mt-4 text-luxury-taupe">Laddar kalender...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-red-600 text-center">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1 text-red-500/70">Kontrollera din anslutning och försök igen</p>
            </div>
          </div>
        ) : (
          <div className="calendar-container">
            <div className="calendar-header">
              <div className="flex items-center space-x-2">
                <div className="text-xl font-medium text-luxury-dark">Maj 2024</div>
                <span className="text-luxury-mid text-sm">•</span>
                <span className="text-luxury-mid text-sm">Vecka 21</span>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 rounded-lg hover:bg-luxury-sand/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-luxury-taupe" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-luxury-sand/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-luxury-taupe" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="px-3 py-1 ml-2 text-sm bg-white/40 hover:bg-luxury-sand/30 rounded-lg text-luxury-dark transition-colors">
                  Idag
                </button>
              </div>
            </div>
            
            <ClientCalendar clients={clients} />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <div className="luxury-card">
          <h3 className="text-lg font-medium text-luxury-dark mb-4">Händelser denna månad</h3>
          <div className="text-3xl font-light text-luxury-dark mb-1">{clients.length}</div>
          <p className="text-luxury-mid">Bokade möten</p>
        </div>
        
        <div className="luxury-card md:col-span-2">
          <h3 className="text-lg font-medium text-luxury-dark mb-4">Snabbtips</h3>
          <p className="text-luxury-mid mb-3">Dra möten för att ändra datum eller dubbelklicka för att redigera detaljer.</p>
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