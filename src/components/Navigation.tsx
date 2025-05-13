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
              <Link 
                href="/dashboard" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/dashboard')
                    ? 'border-luxury-gold text-luxury-dark'
                    : 'border-transparent text-luxury-mid hover:border-luxury-rosegold/50 hover:text-luxury-dark'
                }`}
              >
                Översikt
              </Link>
              <Link 
                href="/clients" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/clients')
                    ? 'border-luxury-gold text-luxury-dark'
                    : 'border-transparent text-luxury-mid hover:border-luxury-rosegold/50 hover:text-luxury-dark'
                }`}
              >
                Klienter
              </Link>
              <Link 
                href="/calendar" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                  isActive('/calendar')
                    ? 'border-luxury-gold text-luxury-dark'
                    : 'border-transparent text-luxury-mid hover:border-luxury-rosegold/50 hover:text-luxury-dark'
                }`}
              >
                Kalender
              </Link>
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
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/dashboard')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              Översikt
            </Link>
            <Link
              href="/clients"
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/clients')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              Klienter
            </Link>
            <Link
              href="/calendar"
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/calendar')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              Kalender
            </Link>
            <Link
              href="/profile"
              className={`block px-3 py-2 text-base font-medium border-l-2 ${
                isActive('/profile')
                  ? 'border-luxury-gold bg-luxury-sand/20 text-luxury-dark'
                  : 'border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark'
              }`}
            >
              Min profil
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center px-3 py-2 text-base font-medium border-l-2 border-transparent text-luxury-mid hover:bg-luxury-sand/10 hover:border-luxury-rosegold/50 hover:text-luxury-dark"
            >
              Logga ut
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 