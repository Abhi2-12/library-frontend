'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Librarian {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function EditLibrarianPage() {
  const router = useRouter();
  const pathname = usePathname(); // e.g. /admin/librarians/edit/3
  const id = pathname.split('/').pop(); // get last part as id

  const [librarian, setLibrarian] = useState<Librarian | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('librarian'); // role fixed for librarian edit
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);

    if (!id) return;

    fetch(`http://localhost:3000/users/${id}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch librarian');
        return res.json();
      })
      .then(data => {
        setLibrarian(data);
        setUsername(data.username);
        setEmail(data.email);
      })
      .catch(() => setError('Failed to load librarian data'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Update failed');
      }

      alert('Librarian updated successfully');
      router.push('/admin/librarians');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!librarian) return <p className="p-4">Loading...</p>;

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Librarian</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            value={role}
            readOnly
          />
          <p className="text-sm text-gray-500 mt-1">Role cannot be changed here.</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Librarian
        </button>
      </form>
    </main>
  );
}
