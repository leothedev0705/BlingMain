'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import ChatBot from './ChatBot';
import { AuthProvider } from '@/app/providers';

interface ClientComponentsProviderProps {
  children: ReactNode;
}

export default function ClientComponentsProvider({ children }: ClientComponentsProviderProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <AuthProvider>
      {children}
      {!isAdminRoute && <ChatBot />}
    </AuthProvider>
  );
} 