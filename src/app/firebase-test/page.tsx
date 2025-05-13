'use client';

import { useState, useEffect } from 'react';
import { testFirebaseConnection } from '@/lib/firebase-debug';

export default function FirebaseTestPage() {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    config?: Record<string, string | undefined>;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTest = async () => {
      try {
        const testResult = await testFirebaseConnection();
        setResult(testResult);
      } catch (error) {
        setResult({
          success: false,
          message: `Ett oväntat fel uppstod: ${(error as Error).message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    runTest();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Firebase Connection Test</h1>
        
        {loading ? (
          <div className="animate-pulse text-gray-600">Testar anslutning...</div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className={`p-4 mb-4 rounded-md ${
              result.success 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <h2 className="text-lg font-medium mb-2">
                Status: {result.success ? 'Anslutning OK' : 'Anslutningsfel'}
              </h2>
              <p>{result.message}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Firebase konfiguration:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(result.config, null, 2)}
              </pre>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Felsökningshjälp:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Kontrollera att alla miljövariabler är korrekt inställda i <code>.env.local</code></li>
                <li>Se till att <strong>NEXT_PUBLIC_FIREBASE_DATABASE_URL</strong> är korrekt angiven</li>
                <li>Verifiera att databasereglerna i Firebase tillåter läsning/skrivning</li>
                <li>Kontrollera att Firebase-projektet är korrekt konfigurerat</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 