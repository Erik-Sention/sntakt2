'use client';

import { Client } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface AppointmentInfo {
  client: Client;
  appointmentType: string;
  details?: string;
  person?: string;
  date: Date;
}

interface ClientCalendarProps {
  clients: Client[];
  initialDate?: Date;
}

export default function ClientCalendar({ clients, initialDate }: ClientCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate || new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDate ? initialDate.getDate() : null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Uppdatera vald månad när initialDate ändras
  useEffect(() => {
    if (initialDate) {
      setCurrentMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
      setSelectedDay(initialDate.getDate());
    }
  }, [initialDate]);

  // Kontrollera URL-parametrar för initiala värden
  useEffect(() => {
    const clientId = searchParams.get('clientId');
    const appointmentType = searchParams.get('appointmentType');
    const day = searchParams.get('day');
    
    if (clientId) {
      setSelectedClientId(clientId);
    }
    
    if (appointmentType) {
      setSelectedAppointmentType(appointmentType);
    }
    
    if (day) {
      const dayNumber = parseInt(day, 10);
      if (!isNaN(dayNumber)) {
        setSelectedDay(dayNumber);
      }
    }
  }, [searchParams]);
  
  // Hjälpfunktioner för kalender
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  // Få dagens dag, månad och år
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthNum = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Beräkna dagar för kalendern
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  
  // Justera för att veckan börjar på måndag i Sverige
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Skapa kalenderarray
  const calendarDays = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null); // Tomma dagar i början av månaden
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Hitta klienter för varje dag och bestäm besökstyp
  const clientsByDay: Record<string, AppointmentInfo[]> = {};
  
  clients.forEach(client => {
    // Läkartid
    if (client.nextDoctorAppointment) {
      const date = new Date(client.nextDoctorAppointment);
      if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
        const day = date.getDate();
        if (!clientsByDay[day]) clientsByDay[day] = [];
        clientsByDay[day].push({
          client,
          appointmentType: 'Läkartid',
          details: client.doctorAppointmentDetails,
          person: client.doctorName,
          date
        });
      }
    }
    
    // Kort kontakt
    if (client.nextShortContact) {
      const date = new Date(client.nextShortContact);
      if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
        const day = date.getDate();
        if (!clientsByDay[day]) clientsByDay[day] = [];
        clientsByDay[day].push({
          client,
          appointmentType: 'Kort kontakt',
          details: client.shortContactDetails,
          person: client.shortContactPerson,
          date
        });
      }
    }
    
    // Långt samtal
    if (client.nextLongConversation) {
      const date = new Date(client.nextLongConversation);
      if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
        const day = date.getDate();
        if (!clientsByDay[day]) clientsByDay[day] = [];
        clientsByDay[day].push({
          client,
          appointmentType: 'Långt samtal',
          details: client.longConversationDetails,
          person: client.longConversationPerson,
          date
        });
      }
    }
    
    // Test
    if (client.nextTest) {
      const date = new Date(client.nextTest);
      if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
        const day = date.getDate();
        if (!clientsByDay[day]) clientsByDay[day] = [];
        clientsByDay[day].push({
          client,
          appointmentType: 'Test',
          details: client.testDetails,
          person: client.testPerson,
          date
        });
      }
    }
    
    // Möte
    if (client.nextMeeting) {
      const date = new Date(client.nextMeeting);
      if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
        const day = date.getDate();
        if (!clientsByDay[day]) clientsByDay[day] = [];
        clientsByDay[day].push({
          client,
          appointmentType: 'Möte + Rapport',
          details: client.meetingDetails,
          person: client.meetingPersons,
          date
        });
      }
    }
  });
  
  // Formatera kalenderrubriker
  const weekdays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
  const monthNames = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ];
  
  // Navigering till föregående och nästa månad
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDay(null);
    setSelectedClientId(null);
    setSelectedAppointmentType(null);
    updateUrl(null, null, null);
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null);
    setSelectedClientId(null);
    setSelectedAppointmentType(null);
    updateUrl(null, null, null);
  };

  // Uppdatera URL med valda parametrar
  const updateUrl = useCallback((day: number | null, clientId: string | null, appointmentType: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (day !== null) {
      params.set('day', day.toString());
    } else {
      params.delete('day');
    }
    
    if (clientId !== null) {
      params.set('clientId', clientId);
    } else {
      params.delete('clientId');
    }
    
    if (appointmentType !== null) {
      params.set('appointmentType', appointmentType);
    } else {
      params.delete('appointmentType');
    }
    
    router.push(`/calendar?${params.toString()}`);
  }, [router, searchParams]);

  // Hantera klick på dag
  const handleDayClick = (day: number | null) => {
    if (day) {
      setSelectedDay(day === selectedDay ? null : day);
      setSelectedClientId(null);
      setSelectedAppointmentType(null);
      updateUrl(day === selectedDay ? null : day, null, null);
    }
  };

  // Hantera klick på klient
  const handleClientClick = (e: React.MouseEvent, clientId: string, appointmentType: string) => {
    e.stopPropagation(); // Förhindra att dag-klick händer samtidigt
    setSelectedClientId(clientId);
    setSelectedAppointmentType(appointmentType);
    updateUrl(selectedDay, clientId, appointmentType);
  };

  // Hitta besöksdetaljer för vald klient
  const getClientAppointments = (day: number) => {
    return clientsByDay[day] || [];
  };

  // Hitta specificerad klient
  const findClient = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  // Få information om det valda besöket
  const getSelectedClientAppointment = (day: number, clientId: string, appointmentType: string) => {
    return clientsByDay[day]?.find(item => 
      item.client.id === clientId && item.appointmentType === appointmentType
    );
  };

  // Formatera tid från Date objekt
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Visa besökets statusikon baserat på typ
  const renderAppointmentIcon = (type: string) => {
    switch (type) {
      case 'Läkartid':
        return (
          <div className="p-1.5 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      case 'Kort kontakt':
        return (
          <div className="p-1.5 rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'Långt samtal':
        return (
          <div className="p-1.5 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
        );
      case 'Test':
        return (
          <div className="p-1.5 rounded-full bg-purple-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      case 'Möte + Rapport':
        return (
          <div className="p-1.5 rounded-full bg-yellow-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-100">
        {weekdays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            onClick={() => handleDayClick(day)}
            className={`border p-2 min-h-[100px] ${
              day === currentDay && 
              currentMonth.getMonth() === currentMonthNum && 
              currentMonth.getFullYear() === currentYear 
                ? 'bg-blue-50' 
                : day === selectedDay
                  ? 'bg-blue-50'
                  : 'bg-white'
            } ${day ? 'cursor-pointer hover:bg-gray-50' : ''}`}
          >
            {day && (
              <>
                <div className="font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {clientsByDay[day]?.map((item, idx) => (
                    <div 
                      key={`${item.client.id}-${item.appointmentType}-${idx}`}
                      onClick={(e) => handleClientClick(e, item.client.id, item.appointmentType)}
                      className={`flex items-center gap-2 text-xs p-1 rounded ${
                        selectedClientId === item.client.id && selectedAppointmentType === item.appointmentType
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      } truncate`}
                    >
                      {renderAppointmentIcon(item.appointmentType)}
                      <span className="truncate">{item.client.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedDay && clientsByDay[selectedDay] && (
        <div className="border-t p-4 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Besök {selectedDay} {monthNames[currentMonth.getMonth()]}
          </h3>
          
          {selectedClientId && selectedAppointmentType ? (
            // Visa detaljer om vald klient
            (() => {
              const appointment = getSelectedClientAppointment(selectedDay, selectedClientId, selectedAppointmentType);
              if (!appointment) return null;
              
              return (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {renderAppointmentIcon(appointment.appointmentType)}
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.client.name}</h4>
                        <p className="text-sm text-gray-600">{appointment.appointmentType}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/clients/${appointment.client.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visa klientprofil
                    </Link>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-4">
                    <div className="min-w-[200px]">
                      <p className="text-sm font-medium text-gray-700">Tid</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(appointment.date)}
                      </p>
                    </div>
                  
                    {appointment.client.clinic && (
                      <div className="min-w-[200px]">
                        <p className="text-sm font-medium text-gray-700">Klinik</p>
                        <p className="text-sm text-gray-600">{appointment.client.clinic}</p>
                      </div>
                    )}
                    
                    {appointment.person && (
                      <div className="min-w-[200px]">
                        <p className="text-sm font-medium text-gray-700">Ansvarig</p>
                        <p className="text-sm text-gray-600">{appointment.person}</p>
                      </div>
                    )}
                  </div>
                  
                  {appointment.details && (
                    <div className="mt-4 border-t pt-3">
                      <p className="text-sm font-medium text-gray-700">Detaljer</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{appointment.details}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => {
                        setSelectedClientId(null);
                        setSelectedAppointmentType(null);
                        updateUrl(selectedDay, null, null);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Tillbaka till alla besök
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            // Visa lista över alla klienter för den valda dagen
            <div className="space-y-2">
              {getClientAppointments(selectedDay).map((item, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setSelectedClientId(item.client.id);
                    setSelectedAppointmentType(item.appointmentType);
                    updateUrl(selectedDay, item.client.id, item.appointmentType);
                  }}
                  className="p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {renderAppointmentIcon(item.appointmentType)}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.client.name}</h4>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-600">{item.appointmentType}</p>
                          <span className="mx-2 text-gray-300">•</span>
                          <p className="text-sm text-gray-600">{formatTime(item.date)}</p>
                        </div>
                      </div>
                    </div>
                    {item.person && (
                      <span className="text-sm text-gray-600 hidden sm:inline">{item.person}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 