'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 z-50"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
