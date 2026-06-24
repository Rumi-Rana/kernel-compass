'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
    async function fetchProfile() {
      const res = await fetch('/api/user/profile/get');
      const data = await res.json();
      setBio(data.bio || '');
      setBirthday(data.birthday || '');
    }
    if (session) fetchProfile();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, bio, image, birthday }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      toast.success('Profile updated!');
      update();
    } else {
      toast.error('Update failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    setImage(url);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <img src={image || '/avatar-placeholder.png'} className="w-20 h-20 rounded-full object-cover" />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800" placeholder="Name" required />
        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800" placeholder="Bio" />
        <div>
          <label className="block mb-1 text-sm">Birthday (MM-DD)</label>
          <input
            type="text"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            placeholder="e.g., 03-15"
            className="w-full p-2 border rounded dark:bg-gray-800"
            pattern="\d{2}-\d{2}"
            title="Format: MM-DD"
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">Save</button>
      </form>
    </div>
  );
}