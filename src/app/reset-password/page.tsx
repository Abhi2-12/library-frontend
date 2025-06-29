'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!email) {
      setMessage('Email is missing from URL');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Password reset successful! You can now log in.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        className="w-full border p-2 mb-3 rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm password"
        className="w-full border p-2 mb-3 rounded"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />
      {message && <p className="text-sm text-red-600 mb-3">{message}</p>}
      <button
        onClick={handleReset}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Reset Password
      </button>
    </div>
  );
}
