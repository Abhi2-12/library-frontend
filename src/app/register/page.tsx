'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');      // <-- Added email state
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          role: 'user'   // <-- role must be lowercase 'user' to match backend enum
        }), 
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <header className="flex items-center space-x-3 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12" />
        </svg>

        <h1 className="text-3xl font-bold text-gray-800">LibraryHub</h1>
      </header>

      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register New User</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </main>
  );
}
