'use client';

import { useState } from 'react';

export default function AddMemberPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('✅ Member added successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('user');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Member</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleAddMember} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full px-3 py-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="user">User</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Member
        </button>
      </form>
    </div>
  );
}
