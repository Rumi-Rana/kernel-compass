'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      toast.success('Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } else {
      toast.error('Error sending message');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <Toaster />
      <div className="max-w-lg w-full p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200 dark:border-gray-700 animate-dramatic">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          <input required placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          <textarea required rows={5} placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          <button type="submit" className="btn-bubbly w-full py-3 text-lg">Send Message</button>
        </form>
      </div>
    </div>
  );
}