'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AppIcon from './AppIcon';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    <nav className="backdrop-blur-md border-b border-luxury-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center text-2xl font-light tracking-wide text-luxury-dark hover:text-luxury-taupe transition-colors duration-300">
                <AppIcon size={28} className="mr-2" />
                <span className="gradient-text font-medium">Sention + Aktivitus</span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <div className="relative group">
                <Link 
                  href="/dashboard" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'border-luxury-gold text-luxury-dark'
                      : 'border-transparent text-luxury-mid hover:border-luxury-rosegold/50 hover:text-luxury-dark'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-luxury-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  Översikt
                </div>
              </div>
              
              <div className="relative group">
                <Link 
                  href="/clients" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                    isActive('/clients')
                      ? 'border-luxury-gold text-luxury-dark'
                      : 'border-transparent text-luxury-mid hover:border-luxury-rosegold/50 hover:text-luxury-dark'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-luxury-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  Klienter
                </div>
              </div>
              
              <div className="relative group">
                <Link 
                  href="/calendar" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                    isActive('/calendar')
                      ? 'border-luxury-gold text-luxury-dark'
                      : 'border-transparent text-luxury-mid hover:border-luxury-rosegold/50 hover:text-luxury-dark'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-luxury-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  Kalender
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-luxury-dark focus:outline-none"
              >
                <span className="mr-2 text-sm">{user.displayName || user.email.split('@')[0]}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
              
              {showUserMenu && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1" role="none">
                    <Link
                      href="/profile"
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/profile') ? 'bg-gray-100' : ''}`}
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Min profil
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Logga ut
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-luxury-mid hover:text-luxury-dark hover:bg-luxury-sand/30 transition-colors duration-300"
            >
              <span className="sr-only">Öppna huvudmenyn</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-white/60 backdrop-blur-md border-t border-luxury-gold/10">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/dashboard')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Översikt
            </Link>
            <Link
              href="/clients"
              className={`flex items-center px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/clients')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Klienter
            </Link>
            <Link
              href="/calendar"
              className={`flex items-center px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/calendar')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Kalender
            </Link>
            <Link
              href="/profile"
              className={`flex items-center px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/profile')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Min profil
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center px-3 py-2 text-base font-medium border-l-2 border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logga ut
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 