'use client';

import AppIcon from '@/components/AppIcon';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <AppIcon size={40} />
        <h1 className="text-4xl font-bold text-blue-600">Sention + Aktivitus</h1>
      </div>
      <p className="mt-4 text-lg text-gray-700">Klientportal</p>
      
      <div className="mt-10 flex flex-col items-center">
        <a 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Logga in
        </a>
        
        <a 
          href="/firebase-test" 
          className="mt-4 text-blue-600 hover:underline"
        >
          Testa Firebase-anslutning
        </a>
      </div>
    </main>
  );
}
