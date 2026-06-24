import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex relative z-10">
      {/* Glass Sidebar */}
      <aside className="w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-pink-200 dark:border-gray-700 p-6 space-y-4 animate-dramatic">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
          >
            📊 Overview
          </Link>
          <Link
            href="/dashboard/posts"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
          >
            📝 Posts
          </Link>
          <Link
            href="/dashboard/comments"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
          >
            💬 Comments
          </Link>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
          >
            ✉️ Messages
          </Link>
          {/* Admin Settings Link */}
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
          >
            ⚙️ Settings
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
    </div>
  );
}