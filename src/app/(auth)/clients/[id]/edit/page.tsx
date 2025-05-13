'use client';

import { useEffect, useState } from 'react';
import { getClient } from '@/lib/clientService';
import { Client } from '@/types';
import ClientForm from '@/components/clients/ClientForm';

export default function EditClientPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClient(id);
        if (data) {
          setClient(data);
        } else {
          setError('Klienten kunde inte hittas');
        }
      } catch (err) {
        console.error('Fel vid hämtning av klient:', err);
        setError('Kunde inte hämta klientens information');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-gray-600">Laddar klientinformation...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
        <div className="text-red-600">{error || 'Klienten kunde inte hittas'}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Redigera klient</h1>
        <p className="text-gray-600">Uppdatera informationen för {client.name}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <ClientForm client={client} isEditing={true} />
      </div>
    </div>
  );
} 