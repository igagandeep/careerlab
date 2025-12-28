'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    Verification: 'The verification link has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  );
}