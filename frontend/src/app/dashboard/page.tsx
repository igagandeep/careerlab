'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    redirect('/');
  }

  const firstName = session.user?.name?.split(' ')[0] || 'User';

  return (
    <>
      <DashboardNavbar />
      <div className="max-w-[1377px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">
          Welcome back, {firstName}! 👋
        </h1>
      </div>
    </>
  );
}