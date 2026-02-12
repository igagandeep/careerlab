'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const firstName = user.name?.split(' ')[0] || 'User';

  return (
    <>
      <DashboardNavbar />
      <div className="max-w-[1377px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Welcome back, {firstName}! 👋</h1>
      </div>
    </>
  );
}
