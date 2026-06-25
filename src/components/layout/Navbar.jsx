'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import {
  HiBell, HiSun, HiMoon, HiPlusCircle,
  HiMenu, HiX,
} from 'react-icons/hi';
import NotificationBell from './NotificationBell';
import { useTheme } from '@/app/ThemeProvider';

export default function Navbar() {
  const { data: session } = useSession();
  const { dark, toggleDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/posts', label: 'Blog' },
    { href: '/vent', label: 'Vent' },
    { href: '/motivation', label: 'Motivation' },
    { href: '/experience', label: 'Experience' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Kernel Compass
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link href="/create">
                <HiPlusCircle size={22} title="Create Post" className="text-pink-500 hover:text-pink-600 transition" />
              </Link>
              <NotificationBell />
              <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Profile</Link>
              <Link href="/saved" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Saved</Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Dashboard</Link>
              )}
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

        {/* Mobile buttons */}
        <div className="flex md:hidden items-center gap-2">
          {session && (
            <>
              <Link href="/create">
                <HiPlusCircle size={22} title="Create Post" className="text-pink-500" />
              </Link>
              <NotificationBell />
            </>
          )}
          <button onClick={toggleDark} className="p-2 text-gray-700 dark:text-gray-300">
            {dark ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-pink-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 pb-4 space-y-2 animate-dramatic">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 transition"
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Profile</Link>
              <Link href="/saved" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Saved</Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Dashboard</Link>
              )}
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">Logout</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/signin" onClick={() => setMobileOpen(false)} className="btn-bubbly btn-bubbly-outline text-sm py-2 text-center">Sign In</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-bubbly text-sm py-2 text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
