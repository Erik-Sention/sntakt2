'use client';

import { Client } from '@/types';
import Link from 'next/link';

interface ClientGridProps {
  clients: Client[];
}

export default function ClientGrid({ clients }: ClientGridProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Klientnamn
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Startdatum
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nästa läkartid
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nästa korta kontakt
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nästa långa samtal
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nästa test
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nästa möte + Rapport
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kommentarer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-800">
                  {client.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.startDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.nextDoctorAppointment}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.nextShortContact}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.nextLongConversation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.nextTest}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.nextMeeting}
              </td>
              <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                {client.comments}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${client.interventionStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                    client.interventionStatus === 'Canceled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {client.interventionStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 