'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check local storage or document class
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light-theme');
    } else {
      setTheme('dark');
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.add('light-theme');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light-theme');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full glass-panel hover:border-brand-bronze/40 hover:bg-brand-brown/30 text-brand-bronze transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
