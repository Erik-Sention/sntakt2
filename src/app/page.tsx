'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Välkommen till Sntakt</h1>
      <p className="mt-4 text-lg text-gray-700">Ditt klienthanteringssystem</p>
    </main>
  );
}
