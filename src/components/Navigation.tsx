'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Utloggningsfel:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-glass backdrop-blur-lg border-b border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-400 text-glow hover:text-blue-300 transition-colors">
                Sntakt
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'border-blue-500 text-blue-100 text-glow'
                    : 'border-transparent text-gray-300 hover:border-blue-400/50 hover:text-blue-200'
                }`}
              >
                Översikt
              </Link>
              <Link 
                href="/clients" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
                  isActive('/clients')
                    ? 'border-blue-500 text-blue-100 text-glow'
                    : 'border-transparent text-gray-300 hover:border-blue-400/50 hover:text-blue-200'
                }`}
              >
                Klienter
              </Link>
              <Link 
                href="/calendar" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
                  isActive('/calendar')
                    ? 'border-blue-500 text-blue-100 text-glow'
                    : 'border-transparent text-gray-300 hover:border-blue-400/50 hover:text-blue-200'
                }`}
              >
                Kalender
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={handleSignOut}
              className="relative group px-4 py-2 rounded-md overflow-hidden"
            >
              <span className="relative z-10 text-sm font-medium text-white group-hover:text-white transition-colors">
                Logga ut
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-0 group-hover:blur-sm bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-70 transition-opacity"></span>
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              <span className="sr-only">Öppna huvudmenyn</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-gray-900/80 backdrop-blur-md border-t border-white/5">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/dashboard')
                  ? 'bg-blue-900/30 border-blue-500 text-blue-200'
                  : 'border-transparent text-gray-300 hover:bg-gray-800/30 hover:border-blue-400/50 hover:text-blue-200'
              }`}
            >
              Översikt
            </Link>
            <Link
              href="/clients"
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/clients')
                  ? 'bg-blue-900/30 border-blue-500 text-blue-200'
                  : 'border-transparent text-gray-300 hover:bg-gray-800/30 hover:border-blue-400/50 hover:text-blue-200'
              }`}
            >
              Klienter
            </Link>
            <Link
              href="/calendar"
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/calendar')
                  ? 'bg-blue-900/30 border-blue-500 text-blue-200'
                  : 'border-transparent text-gray-300 hover:bg-gray-800/30 hover:border-blue-400/50 hover:text-blue-200'
              }`}
            >
              Kalender
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 text-base font-medium border-l-2 border-transparent text-gray-300 hover:bg-gray-800/30 hover:border-blue-400/50 hover:text-blue-200"
            >
              Logga ut
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 