'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      setStatus({ type: 'success', message: data.message });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full space-y-4">
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <p className="text-sm text-gray-500">Enter your registered email to receive a reset link.</p>

        <input
          type="email"
          className="w-full border rounded p-2"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {status && (
          <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
