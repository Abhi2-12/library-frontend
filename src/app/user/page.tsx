'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3000/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data.role !== 'user') {
          router.push('/login');
        } else {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err.message);
        router.push('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}!</h1>
      <p className="mb-6 text-lg">You're logged in as a regular user.</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </main>
  );
}
