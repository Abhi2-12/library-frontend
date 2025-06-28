'use client';

import { useEffect, useState } from 'react';

export default function AdminBookList() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/books/available', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load books');
        return res.json();
      })
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load books.');
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Available Books</h1>
        {error && <p className="text-red-500">{error}</p>}

        {/* 🔍 Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {/* 📚 Book Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">ISBN</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{book.id}</td>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.isbn}</td>
                  <td className="px-4 py-2">{book.status}</td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
