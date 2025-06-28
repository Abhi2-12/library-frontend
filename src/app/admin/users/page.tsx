'use client';

import { useEffect, useState } from 'react';

export default function AdminUserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;
    setToken(storedToken);

    // Fetch all users
    fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setError('Failed to load users'));
  }, []);

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  // Filter to show only users with role 'user'
  const filteredUsers = users.filter(user => user.role === 'user');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full table-auto border">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Total Fine</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <FineAmount userId={user.id} token={token} />
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:underline"
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

// Component to fetch fine amount for a user
function FineAmount({ userId, token }: { userId: number; token: string }) {
  const [fine, setFine] = useState<number | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/fine/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        // Calculate total due fine (sum of all unpaid fines)
        const totalFine = data.reduce((sum: number, fine: any) => {
          return !fine.isPaid ? sum + fine.amount : sum;
        }, 0);
        setFine(totalFine);
      })
      .catch(() => setFine(0));
  }, [userId, token]);

  return <span>{fine !== null ? `৳${fine}` : 'Loading...'}</span>;
}
