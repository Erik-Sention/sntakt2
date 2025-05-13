'use client';

import { Client } from '@/types';
import { useState } from 'react';
import Link from 'next/link';

interface ClientCalendarProps {
  clients: Client[];
}

export default function ClientCalendar({ clients }: ClientCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
  
  // Hitta klienter för varje dag
  const clientsByDay: Record<string, Client[]> = {};
  
  clients.forEach(client => {
    // Försök att hitta alla typer av datumposter för klienten
    const dates = [
      client.startDate,
      client.nextDoctorAppointment,
      client.nextShortContact,
      client.nextLongConversation,
      client.nextTest,
      client.nextMeeting
    ];
    
    dates.forEach(dateStr => {
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      
      // Kontrollera om datumet är i den aktuella månaden
      if (date.getMonth() === currentMonth.getMonth() && 
          date.getFullYear() === currentMonth.getFullYear()) {
        const day = date.getDate();
        
        if (!clientsByDay[day]) {
          clientsByDay[day] = [];
        }
        
        // Undvik dubbletter
        if (!clientsByDay[day].some(c => c.id === client.id)) {
          clientsByDay[day].push(client);
        }
      }
    });
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
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
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
      
      <div className="grid grid-cols-7 auto-rows-fr min-h-[600px]">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`border p-2 min-h-[100px] ${
              day === currentDay && 
              currentMonth.getMonth() === currentMonthNum && 
              currentMonth.getFullYear() === currentYear 
                ? 'bg-blue-50' 
                : 'bg-white'
            }`}
          >
            {day && (
              <>
                <div className="font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {clientsByDay[day]?.map(client => (
                    <Link
                      key={client.id}
                      href={`/clients/${client.id}`}
                      className="block text-xs p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 truncate"
                    >
                      {client.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 