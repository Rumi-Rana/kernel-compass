import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-pink-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>© {new Date().getFullYear()} Kernel Compass. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/contact" className="hover:text-pink-600 dark:hover:text-pink-400 transition">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-pink-600 dark:hover:text-pink-400 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}