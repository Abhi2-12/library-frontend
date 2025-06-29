'use client';

import { useRouter } from 'next/navigation';

export default function LibrarianPage() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, Librarian!</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}
