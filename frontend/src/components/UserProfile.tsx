'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-4 bg-gray-100 rounded">Loading user...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="p-4 bg-yellow-100 rounded">Not signed in</div>;
  }

  if (!session?.user) {
    return <div className="p-4 bg-red-100 rounded">Error loading user</div>;
  }

  return (
    <div className="p-4 bg-green-100 rounded">
      <h3 className="font-bold">Welcome back!</h3>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      {session.user.image && (
        <Image 
          src={session.user.image} 
          alt="Profile" 
          width={40}
          height={40}
          className="rounded-full mt-2"
        />
      )}
    </div>
  );
}