'use client';

import { Client } from '@/types';
import Link from 'next/link';

interface ClientGridProps {
  clients: Client[];
}

export default function ClientGrid({ clients }: ClientGridProps) {
  // Hjälpfunktioner för att bearbeta data
  
  // Formatera datum för visning
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('sv-SE');
  };
  
  // Hitta nästa händelse kronologiskt
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Klientnamn
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Klinik
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Personnummer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nästa händelse
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kontaktperson
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => {
            const nextAppointment = getNextAppointment(client);
            
            return (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-800" scroll={false}>
                    {client.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.clinic || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.personnummer || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {nextAppointment ? nextAppointment.type : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {nextAppointment ? formatDate(nextAppointment.date) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {nextAppointment && nextAppointment.person ? nextAppointment.person : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${client.interventionStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                      client.interventionStatus === 'Canceled' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {client.interventionStatus === 'Planned' ? 'Planerad' : 
                     client.interventionStatus === 'Completed' ? 'Avslutad' : 'Avbruten'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 