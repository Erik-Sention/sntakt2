'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 