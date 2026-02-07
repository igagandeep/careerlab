'use client';

import Image from 'next/image';
import { useAuth } from '@/hooks';

export default function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 bg-gray-100 rounded">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-4 bg-yellow-100 rounded">Not signed in</div>;
  }

  return (
    <div className="p-4 bg-green-100 rounded">
      <h3 className="font-bold">Welcome back!</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {user.image && (
        <Image
          src={user.image}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full mt-2"
        />
      )}
    </div>
  );
}
