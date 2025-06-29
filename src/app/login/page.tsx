'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For eye toggle
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // For theme

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  /*const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };*/


  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    localStorage.setItem('token', data.access_token);

    // Fetch user profile
    const profileRes = await fetch('http://localhost:3000/users/profile', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    if (!profileRes.ok) throw new Error('Failed to fetch profile');
    const profile = await profileRes.json();

    // Redirect based on role
    switch (profile.role.toLowerCase()) {
      case 'admin':
        router.push('/admin');
        break;
      case 'librarian':
        router.push('/librarian');
        break;
      case 'user':
        router.push('/user');
        break;
      default:
        router.push('/');  // or a default public page
        break;
    }
  } catch (err: any) {
    setError(err.message);
  }
};


  return (
    <main className={`flex flex-col items-center justify-center min-h-screen px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Theme toggle button top right */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      {/* Header with logo and LibraryHub text */}
      <header className="flex items-center space-x-3 mb-10">
        {/* Logo: Simple SVG icon example */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-10 w-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
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

        <h1 className="text-3xl font-bold">LibraryHub</h1>
      </header>

      {/* Login form */}
      <form
        onSubmit={handleLogin}
        className={`bg-white p-6 rounded shadow w-full max-w-sm space-y-4
          ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <h2 className="text-xl font-bold text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full px-3 py-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded pr-10"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {/* Eye icon button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              // Eye off icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.522 0-8.473-3.07-9.627-7a10.05 10.05 0 012.042-3.424M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded
            ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Login
        </button>

        {/* Wrap both in a div with text-center */}
<div className="mt-4 space-y-2 text-center">
  <button
    onClick={() => router.push('/guest')}
    className="text-blue-600 hover:underline"
  >
    Continue as Guest
  </button>

  <p
    className="text-sm text-blue-600 hover:underline cursor-pointer"
    onClick={() => router.push('/forgot-password')}
  >
    Forgot password?
  </p>
</div>


        {/* Register link */}
        <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </main>
  );
}
