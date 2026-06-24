import PostEditor from '@/components/editor/PostEditor';

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Post</h1>
      <PostEditor />
    </div>
  );
}