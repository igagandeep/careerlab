'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      // Reduce session polling to prevent hydration issues
      refetchInterval={5 * 60} // 5 minutes
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
