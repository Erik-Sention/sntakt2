'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppIcon from '@/components/AppIcon';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <AppIcon size={40} />
        <h1 className="text-4xl font-bold text-blue-600">Sention + Aktivitus</h1>
      </div>
      <p className="mt-4 text-lg text-gray-700">Klientportal</p>
    </main>
  );
}
