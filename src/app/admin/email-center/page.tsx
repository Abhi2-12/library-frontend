'use client';

import { useState } from 'react';

export default function EmailCenterPage() {
  const [recipientType, setRecipientType] = useState('all'); // all, user, librarian, single
  const [singleEmail, setSingleEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setStatus(null);
    setLoading(true);

    // Build payload
    let to: string[] = [];

    if (recipientType === 'all') {
      to = ['__all__']; // handled in backend
    } else if (recipientType === 'user') {
      to = ['__user__'];
    } else if (recipientType === 'librarian') {
      to = ['__librarian__'];
    } else if (recipientType === 'single') {
      if (!singleEmail || !singleEmail.includes('@')) {
        setStatus({ type: 'error', text: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }
      to = [singleEmail];
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus({ type: 'error', text: 'You must be logged in to send emails.' });
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to,
          subject,
          message,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to send email');
      }

      setStatus({ type: 'success', text: 'Emails sent successfully!' });
      setSubject('');
      setMessage('');
      setSingleEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Error sending emails' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Send Email</h1>

      <label className="block mb-2 font-semibold">Select Recipients</label>
      <select
        value={recipientType}
        onChange={e => setRecipientType(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="all">All Users & Librarians</option>
        <option value="user">All Users Only</option>
        <option value="librarian">All Librarians Only</option>
        <option value="single">Single Email</option>
      </select>

      {recipientType === 'single' && (
        <input
          type="email"
          placeholder="Enter recipient email"
          value={singleEmail}
          onChange={e => setSingleEmail(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
      )}

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={6}
        className="w-full border rounded p-2 mb-4"
      />

      {status && (
        <p
          className={`mb-4 font-semibold ${
            status.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status.text}
        </p>
      )}

      <button
        disabled={loading}
        onClick={handleSend}
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending...' : 'Send Email'}
      </button>
    </div>
  );
}
