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

  // Formatera datum snyggt
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Idag';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Imorgon';
    } else {
      return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-light text-luxury-dark mb-2">Välkommen till <span className="gradient-text font-medium">Sntakt</span></h1>
        <p className="text-luxury-mid text-lg">Hantera dina klienter och kontakter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="luxury-card lg:col-span-3 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-luxury-dark">Kommande kontakter</h2>
            <div className="h-8 w-8 rounded-full bg-luxury-sand/60 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-luxury-taupe" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-luxury-gold animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-luxury-rosegold/30"></div>
                </div>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-600">{error}</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="py-4 text-center text-luxury-mid">Inga kommande kontakter</div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((client) => (
                  <div key={client.id} className="group relative p-4 border border-luxury-gold/10 rounded-xl hover:border-luxury-gold/30 bg-white/40 backdrop-blur-xs transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-luxury-sand flex items-center justify-center text-luxury-taupe">
                        {client.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-luxury-dark font-medium truncate group-hover:text-luxury-taupe transition-colors duration-300">
                          {client.name}
                        </p>
                        <div className="flex mt-1 text-sm text-luxury-mid space-x-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-luxury-gold" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span>{formatDate(client.nextDoctorAppointment)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-luxury-gold" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className={`${
                              client.interventionStatus === 'Completed' ? 'text-green-600' : 
                              client.interventionStatus === 'Canceled' ? 'text-red-600' : 'text-luxury-gold'
                            }`}>{client.interventionStatus}</span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        href={`/clients/${client.id}`}
                        className="flex-shrink-0 text-sm text-luxury-gold hover:text-luxury-taupe group-hover:underline transition-colors duration-300"
                      >
                        Visa detaljer
                      </Link>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 text-right">
              <Link 
                href="/clients"
                className="inline-flex items-center text-sm text-luxury-taupe hover:text-luxury-dark transition-colors duration-300 group"
              >
                Visa alla klienter
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <div className="luxury-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-luxury-dark">Sammanfattning</h2>
              <div className="h-8 w-8 rounded-full bg-luxury-sand/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-luxury-taupe" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 backdrop-blur-xs p-4 rounded-lg border border-luxury-gold/10">
                <p className="text-3xl font-light text-luxury-dark">{clients.length}</p>
                <p className="text-luxury-mid text-sm mt-1">Totala klienter</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xs p-4 rounded-lg border border-luxury-gold/10">
                <p className="text-3xl font-light text-luxury-dark">{upcomingAppointments.length}</p>
                <p className="text-luxury-mid text-sm mt-1">Kommande möten</p>
              </div>
            </div>
          </div>
          
          <div className="luxury-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-luxury-dark">Snabbåtgärder</h2>
              <div className="h-8 w-8 rounded-full bg-luxury-sand/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-luxury-taupe" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/clients/new"
                className="luxury-button w-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Lägg till ny klient
              </Link>
              
              <Link
                href="/calendar"
                className="w-full flex items-center justify-center px-6 py-3 border border-luxury-rosegold/30 rounded-lg font-medium text-luxury-dark hover:bg-luxury-sand/20 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-luxury-rosegold" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Visa kalender
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 