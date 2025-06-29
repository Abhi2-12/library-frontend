'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/guests/books') // Adjust URL if needed
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data) => setBooks(data))
      .catch((err) => {
        console.error(err);
        setError('Could not load books');
      });
  }, []);

  const borrowBook = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required to borrow');

    try {
      const res = await fetch(`http://localhost:3000/guests/books/${id}/borrow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to borrow');
      alert('Book borrowed successfully!');
      router.refresh(); // Reload books
    } catch (err) {
      console.error(err);
      alert('Borrow failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Available Books</h1>
          <button
  onClick={handleLogout}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Login
</button>

        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {Array.isArray(books) && books.length > 0 ? (
            books.map((book: any) => (
              <div key={book.id} className="p-4 border rounded shadow bg-white">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Status: <span className="font-medium">{book.status}</span></p>
                {book.status === 'available' && (
                  <button
                    onClick={() => borrowBook(book.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Borrow
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No books available right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}
