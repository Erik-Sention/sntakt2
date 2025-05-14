'use client';

import { useState } from 'react';
import { Client } from '@/types';
import { updateClient } from '@/lib/clientService';

interface AppointmentEditButtonProps {
  client: Client;
  appointmentType: 
    | 'doctor' 
    | 'shortContact' 
    | 'longConversation' 
    | 'test' 
    | 'meeting';
  onUpdate: () => void;
}

type AppointmentFields = {
  dateField: string;
  personField?: string;
  detailsField?: string;
  title: string;
  personLabel?: string;
};

export default function AppointmentEditButton({ client, appointmentType, onUpdate }: AppointmentEditButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mapping för aktivitetstyper till fältnamn
  const fieldMap: Record<string, AppointmentFields> = {
    doctor: {
      dateField: 'nextDoctorAppointment',
      personField: 'doctorName',
      detailsField: 'doctorAppointmentDetails',
      title: 'Nästa läkartid',
      personLabel: 'Läkare'
    },
    shortContact: {
      dateField: 'nextShortContact',
      personField: 'shortContactPerson',
      detailsField: 'shortContactDetails',
      title: 'Nästa korta kontakt',
      personLabel: 'Kontaktperson'
    },
    longConversation: {
      dateField: 'nextLongConversation',
      personField: 'longConversationPerson',
      detailsField: 'longConversationDetails',
      title: 'Nästa långa samtal',
      personLabel: 'Samtalsperson'
    },
    test: {
      dateField: 'nextTest',
      personField: 'testPerson',
      detailsField: 'testDetails',
      title: 'Nästa test',
      personLabel: 'Testansvarig'
    },
    meeting: {
      dateField: 'nextMeeting',
      personField: 'meetingPersons',
      detailsField: 'meetingDetails',
      title: 'Nästa möte + Rapport',
      personLabel: 'Mötesdeltagare'
    }
  };
  
  const fields = fieldMap[appointmentType];
  
  const [formData, setFormData] = useState({
    [fields.dateField]: client[fields.dateField as keyof Client] as string || '',
    [fields.personField as string]: fields.personField ? client[fields.personField as keyof Client] as string || '' : '',
    [fields.detailsField as string]: fields.detailsField ? client[fields.detailsField as keyof Client] as string || '' : ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await updateClient(client.id, formData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Fel vid uppdatering av aktivitet:', err);
      setError('Något gick fel när aktiviteten skulle uppdateras. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redigeringsknapp som visas i vanligt läge
  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center px-2 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label={`Redigera ${fields.title.toLowerCase()}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    );
  }

  // Redigeringsformulär som visas när man redigerar
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Redigera {fields.title.toLowerCase()}</h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        <div>
          <label htmlFor={fields.dateField} className="block text-xs font-medium text-gray-500 mb-1">
            Datum
          </label>
          <input
            type="date"
            id={fields.dateField}
            name={fields.dateField}
            value={formData[fields.dateField]}
            onChange={handleChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {fields.personField && (
          <div>
            <label htmlFor={fields.personField} className="block text-xs font-medium text-gray-500 mb-1">
              {fields.personLabel}
            </label>
            <input
              type="text"
              id={fields.personField}
              name={fields.personField}
              value={formData[fields.personField]}
              onChange={handleChange}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        {fields.detailsField && (
          <div>
            <label htmlFor={fields.detailsField} className="block text-xs font-medium text-gray-500 mb-1">
              Detaljer
            </label>
            <textarea
              id={fields.detailsField}
              name={fields.detailsField}
              value={formData[fields.detailsField]}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1 text-xs border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Sparar...' : 'Spara'}
          </button>
        </div>
      </form>
    </div>
  );
} 