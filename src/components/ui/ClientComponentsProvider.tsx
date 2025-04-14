'use client';

import { ReactNode } from 'react';
import ChatBot from './ChatBot';
import { AuthProvider } from '@/app/providers';

interface ClientComponentsProviderProps {
  children: ReactNode;
}

export default function ClientComponentsProvider({ children }: ClientComponentsProviderProps) {
  return (
    <AuthProvider>
      {children}
      <ChatBot />
    </AuthProvider>
  );
} 