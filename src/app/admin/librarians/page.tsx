'use client';

import { useEffect, useState } from 'react';

interface Librarian {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function LibrarianPage() {
  const [librarians, setLibrarians] = useState<Librarian[]>([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    setToken(storedToken);

    fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((u: Librarian) => u.role === 'librarian');
        setLibrarians(filtered);
      })
      .catch(() => setError('Failed to load librarians'));
  }, []);

  const deleteLibrarian = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this librarian?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete');
      setLibrarians(prev => prev.filter(lib => lib.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Librarians</h1>

      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white rounded shadow text-sm border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 border">ID</th>
            <th className="px-4 py-3 border">Username</th>
            <th className="px-4 py-3 border">Email</th>
            <th className="px-4 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {librarians.map(lib => (
            <tr key={lib.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{lib.id}</td>
              <td className="px-4 py-2 border">{lib.username}</td>
              <td className="px-4 py-2 border">{lib.email}</td>
              <td className="px-4 py-2 border space-x-2">
                {/* Placeholder for edit functionality */}
                <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => window.location.href = `/admin/librarians/edit/${lib.id}`}
                >
                Edit
                </button>

                <button
                  onClick={() => deleteLibrarian(lib.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
