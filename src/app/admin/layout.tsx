// src/app/admin/layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import '../../app/globals.css'; // Ensure this path is correct

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">LibraryHub Admin</h2>
        <nav className="flex flex-col space-y-3">
          <Link href="/admin" className="hover:text-blue-300">📊 Dashboard</Link>
          <Link href="/admin/books" className="hover:text-blue-300">📖 Books</Link>
          <Link href="/admin/users" className="hover:text-blue-300">👤 Users</Link>
          <Link href="/admin/librarians" className="hover:text-blue-300">📚 Librarians</Link>
          <Link href="/admin/add-member" className="hover:text-blue-300">➕ Add Member</Link>
          <Link href="/admin/email-center" className="hover:text-blue-300">✉️ Email Center</Link>
          <Link href="/admin/account" className="hover:text-blue-300">⚙️ Account</Link>
          <Link href="/logout" className="hover:text-red-400 mt-6">🚪 Logout</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
