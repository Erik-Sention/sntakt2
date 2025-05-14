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

  // Hjälpfunktioner för att hantera data
  
  // Formatera datum snyggt
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    
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

  // Hitta nästa händelse kronologiskt för en klient
  const getNextAppointment = (client: Client) => {
    // Samla alla datum i ett objekt med typ och datum
    const appointments = [
      { type: 'Läkartid', date: client.nextDoctorAppointment, person: client.doctorName },
      { type: 'Kort kontakt', date: client.nextShortContact, person: client.shortContactPerson },
      { type: 'Långt samtal', date: client.nextLongConversation, person: client.longConversationPerson },
      { type: 'Test', date: client.nextTest, person: client.testPerson },
      { type: 'Möte', date: client.nextMeeting, person: client.meetingPersons }
    ];
    
    // Filtrera bort tomma datum
    const validAppointments = appointments.filter(a => a.date);
    
    // Sortera efter datum (tidigast först)
    validAppointments.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Returnera den första händelsen eller null om det inte finns någon
    return validAppointments.length > 0 ? validAppointments[0] : null;
  };

  // Skapa en lista med alla kommande händelser
  const getAllUpcomingAppointments = () => {
    let allAppointments: {
      clientId: string;
      clientName: string;
      personnummer: string | undefined;
      type: string;
      date: string;
      person: string | undefined;
    }[] = [];

    clients.forEach(client => {
      // För varje klient, lägg till alla deras händelser
      if (client.nextDoctorAppointment) {
        allAppointments.push({
          clientId: client.id,
          clientName: client.name,
          personnummer: client.personnummer,
          type: 'Läkartid',
          date: client.nextDoctorAppointment,
          person: client.doctorName
        });
      }
      
      if (client.nextShortContact) {
        allAppointments.push({
          clientId: client.id,
          clientName: client.name,
          personnummer: client.personnummer,
          type: 'Kort kontakt',
          date: client.nextShortContact,
          person: client.shortContactPerson
        });
      }
      
      if (client.nextLongConversation) {
        allAppointments.push({
          clientId: client.id,
          clientName: client.name,
          personnummer: client.personnummer,
          type: 'Långt samtal',
          date: client.nextLongConversation,
          person: client.longConversationPerson
        });
      }
      
      if (client.nextTest) {
        allAppointments.push({
          clientId: client.id,
          clientName: client.name,
          personnummer: client.personnummer,
          type: 'Test',
          date: client.nextTest,
          person: client.testPerson
        });
      }
      
      if (client.nextMeeting) {
        allAppointments.push({
          clientId: client.id,
          clientName: client.name,
          personnummer: client.personnummer,
          type: 'Möte',
          date: client.nextMeeting,
          person: client.meetingPersons
        });
      }
    });

    // Filtrera bort datum som redan passerat
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    allAppointments = allAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    });

    // Sortera alla händelser efter datum
    allAppointments.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    // Begränsa till 8 kommande händelser
    return allAppointments.slice(0, 8);
  };

  // Hämta alla kommande händelser från alla klienter, sorterade efter datum
  const upcomingAppointments = getAllUpcomingAppointments();

  // Räkna händelser denna vecka
  const countEventsThisWeek = () => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    return upcomingAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate <= endOfWeek;
    }).length;
  };

  // Hitta klienter utan någon planerad aktivitet
  const inactiveClients = clients.filter(client => {
    // Filtrera bara aktiva klienter (status Planned) utan planerade aktiviteter
    return client.interventionStatus === 'Planned' && 
           !client.nextDoctorAppointment && 
           !client.nextShortContact && 
           !client.nextLongConversation && 
           !client.nextTest && 
           !client.nextMeeting;
  });

  return (
    <div className="space-y-8">
      <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-light text-luxury-dark mb-2">Välkommen till <span className="gradient-text font-medium">Sention + Aktivitus Klientportal</span></h1>
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
                {upcomingAppointments.map((appointment, index) => (
                  <div key={`${appointment.clientId}-${appointment.type}-${index}`} className="group relative p-4 border border-luxury-gold/10 rounded-xl hover:border-luxury-gold/30 bg-white/40 backdrop-blur-xs transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-luxury-sand flex items-center justify-center text-luxury-taupe">
                        {appointment.clientName.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-luxury-dark font-medium group-hover:text-luxury-taupe transition-colors duration-300">
                            {appointment.clientName}
                          </p>
                          <span className="px-2 py-0.5 bg-luxury-sand/30 text-xs rounded-full">
                            {appointment.type}
                          </span>
                        </div>
                        <div className="flex mt-1 text-sm text-luxury-mid space-x-4">
                          {appointment.personnummer && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-luxury-gold" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <span>{appointment.personnummer}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-luxury-gold" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className={`${
                              formatDate(appointment.date) === 'Idag' ? 'text-red-600 font-semibold' : 
                              formatDate(appointment.date) === 'Imorgon' ? 'text-orange-600' : ''
                            }`}>{formatDate(appointment.date)}</span>
                          </div>
                          {appointment.person && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-luxury-gold" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                              <span>{appointment.person}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link 
                        href={`/clients/${appointment.clientId}`}
                        className="flex-shrink-0 text-sm text-luxury-gold hover:text-luxury-taupe group-hover:underline transition-colors duration-300"
                        scroll={false}
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
                scroll={false}
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
                <p className="text-3xl font-light text-luxury-dark">{countEventsThisWeek()}</p>
                <p className="text-luxury-mid text-sm mt-1">Kommande möten</p>
              </div>
            </div>

            {inactiveClients.length > 0 && (
              <div className="mt-4">
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold mb-1">Klienter utan planerad aktivitet</p>
                      <ul className="list-disc list-inside">
                        {inactiveClients.map(client => (
                          <li key={client.id}>
                            <Link href={`/clients/${client.id}`} className="hover:underline" scroll={false}>
                              {client.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
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