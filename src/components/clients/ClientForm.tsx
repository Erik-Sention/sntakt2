'use client';

import { useState } from 'react';
import { Client } from '@/types';
import { useRouter } from 'next/navigation';
import { addClient, updateClient } from '@/lib/clientService';

interface ClientFormProps {
  client?: Client;
  isEditing?: boolean;
}

export default function ClientForm({ client, isEditing = false }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: client?.name || '',
    startDate: client?.startDate || formatDate(new Date()),
    nextDoctorAppointment: client?.nextDoctorAppointment || '',
    nextShortContact: client?.nextShortContact || '',
    nextLongConversation: client?.nextLongConversation || '',
    nextTest: client?.nextTest || '',
    nextMeeting: client?.nextMeeting || '',
    comments: client?.comments || '',
    interventionStatus: client?.interventionStatus || 'Planned' as 'Planned' | 'Completed' | 'Canceled'
  });

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing && client) {
        await updateClient(client.id, formData);
      } else {
        await addClient(formData);
      }
      router.push('/clients');
      router.refresh();
    } catch (err) {
      console.error('Fel vid sparande av klient:', err);
      setError('Något gick fel när klienten skulle sparas. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Namn
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Startdatum
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextDoctorAppointment" className="block text-sm font-medium text-gray-700 mb-1">
            Nästa läkartid
          </label>
          <input
            type="date"
            id="nextDoctorAppointment"
            name="nextDoctorAppointment"
            value={formData.nextDoctorAppointment}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextShortContact" className="block text-sm font-medium text-gray-700 mb-1">
            Nästa korta kontakt
          </label>
          <input
            type="date"
            id="nextShortContact"
            name="nextShortContact"
            value={formData.nextShortContact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextLongConversation" className="block text-sm font-medium text-gray-700 mb-1">
            Nästa långa samtal
          </label>
          <input
            type="date"
            id="nextLongConversation"
            name="nextLongConversation"
            value={formData.nextLongConversation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextTest" className="block text-sm font-medium text-gray-700 mb-1">
            Nästa test
          </label>
          <input
            type="date"
            id="nextTest"
            name="nextTest"
            value={formData.nextTest}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nextMeeting" className="block text-sm font-medium text-gray-700 mb-1">
            Nästa möte + Rapport
          </label>
          <input
            type="date"
            id="nextMeeting"
            name="nextMeeting"
            value={formData.nextMeeting}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="interventionStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="interventionStatus"
            name="interventionStatus"
            value={formData.interventionStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Planned">Planerad</option>
            <option value="Completed">Avslutad</option>
            <option value="Canceled">Avbruten</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
          Kommentarer
        </label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Sparar...' : isEditing ? 'Uppdatera klient' : 'Skapa klient'}
        </button>
      </div>
    </form>
  );
} 