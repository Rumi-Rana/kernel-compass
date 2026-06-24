'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { HiBell, HiSun, HiMoon, HiPlusCircle } from 'react-icons/hi';
import NotificationBell from './NotificationBell';
import { useTheme } from '@/app/ThemeProvider';

export default function Navbar() {
  const { data: session } = useSession();
  const { dark, toggleDark } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Kernel Compass
        </Link>
        <div className="flex gap-4 items-center text-sm">
          <Link href="/posts" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Blog</Link>
          <Link href="/vent" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Vent</Link>
          <Link href="/motivation" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Motivation</Link>
          <Link href="/experience" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Experience</Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition">Contact</Link>
          {session ? (
            <>
              <Link href="/create" className="text-pink-500 hover:text-pink-600 transition">
                <HiPlusCircle size={22} title="Create Post" />
              </Link>
              <NotificationBell />
              <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Profile</Link>
              <Link href="/saved" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Saved</Link>
              {session.user.role === 'ADMIN' && <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Dashboard</Link>}
              <button onClick={() => signOut()} className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="btn-bubbly btn-bubbly-outline text-sm py-1.5 px-4">Sign In</Link>
              <Link href="/signup" className="btn-bubbly text-sm py-1.5 px-4">Sign Up</Link>
            </>
          )}
          <button onClick={toggleDark} className="p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">
            {dark ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}