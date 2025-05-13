'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError('Inloggningen misslyckades. Kontrollera dina uppgifter.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 relative overflow-hidden">
      {/* Animerade bakgrundselement */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-30" style={{ background: 'var(--primary-glow)' }}></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-float"></div>
        <div className="absolute top-60 -right-20 w-60 h-60 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-float animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-float animation-delay-4000"></div>
      </div>

      {/* Hexagon grid effekt */}
      <div className="absolute inset-0 opacity-5 z-0" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23ffffff' d='M12 2l10 6v8l-10 6-10-6V8l10-6z'/%3E%3C/svg%3E")`,
             backgroundSize: '24px 24px'
           }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="px-8 py-10 bg-glass rounded-2xl shadow-2xl animate-glow">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white text-glow mb-2">Sntakt</h1>
            <p className="text-gray-300">Logga in för att fortsätta</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/80 text-white p-4 rounded-lg text-sm font-medium border-l-4 border-red-500 animate-pulse">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                E-post
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 group-hover:border-blue-500/50"
                  placeholder="namn@exempel.se"
                />
                <div className="absolute inset-0 rounded-lg border border-blue-400/0 group-hover:border-blue-400/20 pointer-events-none transition-all"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Lösenord
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 group-hover:border-blue-500/50"
                  placeholder="••••••••"
                />
                <div className="absolute inset-0 rounded-lg border border-blue-400/0 group-hover:border-blue-400/20 pointer-events-none transition-all"></div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg shadow-blue-700/30 disabled:opacity-50 mt-8 relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? 'Loggar in...' : 'Logga in'}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 group-hover:opacity-90 transition-opacity opacity-100"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></span>
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-400 relative z-10">
        Kontakta din administratör om du behöver hjälp med inloggningen
      </div>
    </div>
  );
} 