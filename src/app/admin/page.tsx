'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }

    setToken(storedToken);

    fetch('http://localhost:3000/users/profile', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to load profile');
        }
        return res.json();
      })
      .then(data => {
        if (data.role !== 'admin') {
          router.push('/login');
        } else {
          setUser(data);
          fetchUsers(storedToken);
        }
      })
      .catch(err => {
        console.error('Profile error:', err.message);
        router.push('/login');
      });
  }, [router]);

  const fetchUsers = (token: string) => {
    fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
      });
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      setUsers(prev => prev.filter(u => u.id !== id));
      setFilteredUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      u =>
        u.username.toLowerCase().includes(term) ||
        (u.email?.toLowerCase().includes(term)) ||
        u.role.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  if (!user) return <p className="p-4 text-center text-white bg-black">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome message */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold">{user.username}</span>! Role:{' '}
            <span className="uppercase font-semibold">{user.role}</span>
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-end mb-4 space-x-2 max-w-sm">
          <input
            type="text"
            placeholder="Search users..."
            className="flex-grow px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0a7 7 0 11-9.9-9.9 7 7 0 019.9 9.9z" />
            </svg>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          {error && <p className="text-red-500">{error}</p>}

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-medium">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{u.email || '-'}</td>
                    <td className="px-4 py-2">
                      {u.id !== user.id ? (
                        <button
                          onClick={() => router.push(`/admin/users/${u.id}`)}
                          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          View Details
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Current Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
