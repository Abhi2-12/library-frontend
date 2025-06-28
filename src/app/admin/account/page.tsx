'use client';

import { useEffect, useState } from 'react';

type AccountSummary = {
  totalReceived: number;
  totalDue: number;
};

export default function AccountPage() {
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/fine/account-summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch account summary');
        const data = await res.json();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Account Summary</h1>

      <div className="flex justify-between mb-4">
        <span className="font-semibold text-gray-700">Total Received Fines:</span>
        <span className="text-green-600 font-semibold">৳{summary?.totalReceived}</span>
      </div>

      <div className="flex justify-between">
        <span className="font-semibold text-gray-700">Total Due Fines:</span>
        <span className="text-red-600 font-semibold">৳{summary?.totalDue}</span>
      </div>
    </div>
  );
}
