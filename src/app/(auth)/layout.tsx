'use client';

import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-sand/30">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-luxury-gold animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-luxury-rosegold/40"></div>
          </div>
          <div className="mt-4 text-luxury-taupe">Laddar...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-sand/30 text-luxury-dark overflow-hidden">
      <Navigation />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-luxury-gradient opacity-40 -z-10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none -z-10"></div>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <div className="fixed -bottom-64 -left-64 w-[500px] h-[500px] rounded-full bg-luxury-gold/10 blur-3xl -z-10"></div>
      <div className="fixed -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-luxury-rosegold/10 blur-3xl -z-10"></div>
    </div>
  );
} 