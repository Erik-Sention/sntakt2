'use client';

import ClientForm from '@/components/clients/ClientForm';

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lägg till ny klient</h1>
        <p className="text-gray-600">Fyll i detaljerna nedan för att skapa en ny klient</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <ClientForm />
      </div>
    </div>
  );
} 