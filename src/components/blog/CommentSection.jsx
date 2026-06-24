'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { HiHeart, HiReply, HiTrash } from 'react-icons/hi';
import AudioRecorder from './AudioRecorder';

export default function CommentSection({ postId, slug }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    const parentId = replyTo ? replyTo.id : null;
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newComment, postId, parentId }),
    });
    if (res.ok) {
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    }
    setLoading(false);
  };

  const handleLike = async (commentId) => {
    const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    if (res.ok) fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`/api/dashboard/comments/${commentId}`, { method: 'DELETE' });
    fetchComments();
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 pl-4' : ''} mb-4`}>
      <div className="flex items-start gap-2">
        <img src={comment.user?.image || '/avatar-placeholder.png'} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-semibold text-sm">{comment.user?.name}</span>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: comment.text }} className="prose dark:prose-invert text-sm max-w-none" />
          <div className="flex gap-3 mt-1 text-xs">
            <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1">
              <HiHeart className={comment.likes?.some(l => l.userId === session?.user?.id) ? 'text-red-500' : ''} />
              {comment._count?.likes || comment.likes?.length || 0}
            </button>
            <button onClick={() => setReplyTo(comment)}>Reply</button>
            {session?.user?.role === 'ADMIN' && (
              <button onClick={() => handleDelete(comment.id)} className="text-red-500">Delete</button>
            )}
          </div>
          {replyTo?.id === comment.id && (
            <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 p-2 border rounded dark:bg-gray-800 text-sm"
              />
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Reply</button>
              <button type="button" onClick={() => setReplyTo(null)} className="text-sm">Cancel</button>
            </form>
          )}
        </div>
      </div>
      {comment.replies?.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      {session ? (
        <>
          <form onSubmit={handleSubmit} className="mb-6 flex gap-2 items-start">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @username to mention"
              className="w-full p-3 border rounded dark:bg-gray-800 resize-none"
              rows={3}
            />
            <AudioRecorder onRecordingComplete={(url) => setNewComment(prev => prev + ` <audio controls src="${url}"></audio>`)} />
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">Post</button>
          </form>
        </>
      ) : (
        <p className="text-sm mb-4">Please <a href="/signin" className="text-indigo-600">sign in</a> to comment.</p>
      )}
      <div>
        {comments.filter(c => !c.parentId).map(c => renderComment(c))}
      </div>
    </div>
  );
}