import prisma from '@/lib/prisma';

export default async function DashboardMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 animate-dramatic">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Messages
      </h1>
      <div className="space-y-4">
        {messages.map(m => (
          <div
            key={m.id}
            className="p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-pink-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.email}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">{m.subject}</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No contact messages yet.</p>
        )}
      </div>
    </div>
  );
}