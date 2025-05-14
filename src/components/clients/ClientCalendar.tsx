'use client';

import { Client } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ClientCalendarProps {
  clients: Client[];
  initialDate?: Date;
}

export default function ClientCalendar({ clients, initialDate }: ClientCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate || new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(initialDate ? initialDate.getDate() : null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Uppdatera vald månad när initialDate ändras
  useEffect(() => {
    if (initialDate) {
      setCurrentMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
      setSelectedDay(initialDate.getDate());
    }
  }, [initialDate]);
  
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
  const clientsByDay: Record<string, {client: Client, appointmentType: string, details?: string, person?: string}[]> = {};
  
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
          person: client.doctorName
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
          person: client.shortContactPerson
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
          person: client.longConversationPerson
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
          person: client.testPerson
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
          person: client.meetingPersons
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
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  // Hantera klick på dag
  const handleDayClick = (day: number | null) => {
    if (day) {
      setSelectedDay(day === selectedDay ? null : day);
      setSelectedClientId(null);
    }
  };

  // Hantera klick på klient
  const handleClientClick = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation(); // Förhindra att dag-klick händer samtidigt
    setSelectedClientId(clientId);
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
  const getSelectedClientAppointment = (day: number, clientId: string) => {
    return clientsByDay[day]?.find(item => item.client.id === clientId);
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
                  {clientsByDay[day]?.map(item => (
                    <div 
                      key={`${item.client.id}-${item.appointmentType}`}
                      onClick={(e) => handleClientClick(e, item.client.id)}
                      className={`block text-xs p-1 rounded ${
                        selectedClientId === item.client.id 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      } truncate`}
                    >
                      {item.client.name} - {item.appointmentType}
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
          
          {selectedClientId ? (
            // Visa detaljer om vald klient
            (() => {
              const appointment = getSelectedClientAppointment(selectedDay, selectedClientId);
              if (!appointment) return null;
              
              return (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.client.name}</h4>
                      <p className="text-sm text-gray-600">{appointment.appointmentType}</p>
                    </div>
                    <Link 
                      href={`/clients/${appointment.client.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visa klientprofil
                    </Link>
                  </div>
                  
                  {appointment.client.clinic && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Klinik</p>
                      <p className="text-sm text-gray-600">{appointment.client.clinic}</p>
                    </div>
                  )}
                  
                  {appointment.person && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Ansvarig</p>
                      <p className="text-sm text-gray-600">{appointment.person}</p>
                    </div>
                  )}
                  
                  {appointment.details && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Detaljer</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{appointment.details}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setSelectedClientId(null)}
                    className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Tillbaka
                  </button>
                </div>
              );
            })()
          ) : (
            // Visa lista över alla klienter för den valda dagen
            <div className="space-y-2">
              {getClientAppointments(selectedDay).map((item, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedClientId(item.client.id)}
                  className="p-3 bg-white rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.client.name}</h4>
                      <p className="text-sm text-gray-600">{item.appointmentType}</p>
                    </div>
                    {item.person && (
                      <span className="text-sm text-gray-600">{item.person}</span>
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