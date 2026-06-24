import Link from 'next/link';
import Image from 'next/image';

export default function PostCard({ post }) {
  return (
    <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 backdrop-blur-md shadow-lg hover-lift overflow-hidden">
      {post.coverImage && (
        <Image src={post.coverImage} alt={post.title} width={400} height={200} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Link href={`/post/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.excerpt}</p>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          <Link
  href={`/profile/${post.author.id}`}
  className="hover:text-pink-600 dark:hover:text-pink-400 transition"
>
  {post.author.name}
</Link>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}