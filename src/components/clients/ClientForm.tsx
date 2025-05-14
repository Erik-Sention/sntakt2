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
    clinic: client?.clinic || '',
    nextDoctorAppointment: client?.nextDoctorAppointment || '',
    doctorName: client?.doctorName || '',
    doctorAppointmentDetails: client?.doctorAppointmentDetails || '',
    nextShortContact: client?.nextShortContact || '',
    shortContactPerson: client?.shortContactPerson || '',
    shortContactDetails: client?.shortContactDetails || '',
    nextLongConversation: client?.nextLongConversation || '',
    longConversationPerson: client?.longConversationPerson || '',
    longConversationDetails: client?.longConversationDetails || '',
    nextTest: client?.nextTest || '',
    testPerson: client?.testPerson || '',
    testDetails: client?.testDetails || '',
    nextMeeting: client?.nextMeeting || '',
    meetingPersons: client?.meetingPersons || '',
    meetingDetails: client?.meetingDetails || '',
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
          <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-1">
            Klinik
          </label>
          <input
            type="text"
            id="clinic"
            name="clinic"
            value={formData.clinic}
            onChange={handleChange}
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
          <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
            Läkare
          </label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="doctorAppointmentDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Detaljer om läkarbesöket
          </label>
          <textarea
            id="doctorAppointmentDetails"
            name="doctorAppointmentDetails"
            value={formData.doctorAppointmentDetails}
            onChange={handleChange}
            rows={2}
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
          <label htmlFor="shortContactPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Kontaktperson
          </label>
          <input
            type="text"
            id="shortContactPerson"
            name="shortContactPerson"
            value={formData.shortContactPerson}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="shortContactDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Detaljer om korta kontakten
          </label>
          <textarea
            id="shortContactDetails"
            name="shortContactDetails"
            value={formData.shortContactDetails}
            onChange={handleChange}
            rows={2}
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
          <label htmlFor="longConversationPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Samtalsperson
          </label>
          <input
            type="text"
            id="longConversationPerson"
            name="longConversationPerson"
            value={formData.longConversationPerson}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="longConversationDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Detaljer om långa samtalet
          </label>
          <textarea
            id="longConversationDetails"
            name="longConversationDetails"
            value={formData.longConversationDetails}
            onChange={handleChange}
            rows={2}
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
          <label htmlFor="testPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Testansvarig
          </label>
          <input
            type="text"
            id="testPerson"
            name="testPerson"
            value={formData.testPerson}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="testDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Detaljer om testet
          </label>
          <textarea
            id="testDetails"
            name="testDetails"
            value={formData.testDetails}
            onChange={handleChange}
            rows={2}
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
          <label htmlFor="meetingPersons" className="block text-sm font-medium text-gray-700 mb-1">
            Mötesdeltagare
          </label>
          <input
            type="text"
            id="meetingPersons"
            name="meetingPersons"
            value={formData.meetingPersons}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="meetingDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Detaljer om mötet
          </label>
          <textarea
            id="meetingDetails"
            name="meetingDetails"
            value={formData.meetingDetails}
            onChange={handleChange}
            rows={2}
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