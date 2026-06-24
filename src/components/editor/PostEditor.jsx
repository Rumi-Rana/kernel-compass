'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import YoutubeExtension from '@tiptap/extension-youtube';
import { Mark, Node } from '@tiptap/core';
import toast from 'react-hot-toast';

/* ---------- Custom FontSize Mark ---------- */
const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() { return { fontSize: { default: null, parseHTML: el => el.style.fontSize, renderHTML: attrs => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {} } }; },
  parseHTML() { return [{ style: 'font-size' }]; },
  renderHTML({ HTMLAttributes }) { return ['span', HTMLAttributes, 0]; },
  addCommands() { return { setFontSize: (fs) => ({ chain }) => chain().setMark('fontSize', { fontSize: fs }).run(), unsetFontSize: () => ({ chain }) => chain().unsetMark('fontSize').run() }; },
});

/* ---------- Custom Image ---------- */
const CustomImage = Node.create({
  name: 'image', group: 'inline', inline: true, draggable: true,
  addAttributes() { return { src: {}, alt: { default: null }, title: { default: null }, width: { default: null }, height: { default: null }, align: { default: 'left' } }; },
  parseHTML() { return [{ tag: 'img[src]', getAttrs: dom => ({ src: dom.getAttribute('src'), alt: dom.getAttribute('alt'), title: dom.getAttribute('title'), width: dom.getAttribute('width') || dom.style.width, height: dom.getAttribute('height') || dom.style.height, align: dom.getAttribute('data-align') || dom.style.textAlign || 'left' }) }]; },
  renderHTML({ HTMLAttributes }) {
    const { width, height, align, ...rest } = HTMLAttributes; const style = [];
    if (width) style.push(`width: ${width}`); if (height) style.push(`height: ${height}`);
    if (align === 'center') style.push('display: block', 'margin-left: auto', 'margin-right: auto');
    else if (align === 'right') style.push('float: right', 'margin-left: 1rem');
    else style.push('float: left', 'margin-right: 1rem');
    return ['img', { ...rest, style: style.join('; '), 'data-align': align }];
  },
  addCommands() { return { setImage: attrs => ({ chain }) => chain().insertContent({ type: 'image', attrs }).run() }; },
});

/* ---------- Buttons ---------- */
function ImageUploadButton({ editor }) { /* same as before */ }
function LinkButton({ editor }) { /* same */ }
function FontSizeSelector({ editor }) { /* same */ }
function VideoButton({ editor }) { /* same */ }
function FormatImageButton({ editor }) {
  const handleFormat = () => {
    const { from, to } = editor.state.selection;
    let node = null, pos = null;
    editor.state.doc.nodesBetween(from, to, (n, p) => { if (n.type.name === 'image') { node = n; pos = p; return false; } });
    if (!node) { alert('Click on the image first, then use this button.'); return; }
    const curWidth = node.attrs.width || ''; const curAlign = node.attrs.align || 'left';
    const input = window.prompt(`Enter width (e.g., 400px or 50%) and alignment (left, center, right)\nExample: 300px, center\n\nCurrent: ${curWidth || 'auto'}, ${curAlign}`, `${curWidth || ''}, ${curAlign}`);
    if (!input) return;
    const parts = input.split(',').map(s => s.trim());
    const newWidth = parts[0] || null; const newAlign = parts[1]?.toLowerCase() || curAlign;
    if (!['left','center','right'].includes(newAlign)) { alert('Alignment must be left, center, or right.'); return; }
    editor.chain().focus().setNodeSelection(pos).updateAttributes('image', { width: newWidth || null, align: newAlign }).run();
  };
  return <button onClick={handleFormat} className="text-sm px-2 py-1 rounded hover:bg-pink-100 dark:hover:bg-pink-900" title="Resize & Align Image">🖼️</button>;
}

export default function PostEditor({ post = null }) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [published, setPublished] = useState(post?.published || false);
  const [tags, setTags] = useState(post?.tags || '');
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit, CustomImage,
      LinkExtension.configure({ openOnClick: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: 'Write your post...' }),
      FontSize,
      YoutubeExtension.configure({ controls: true, nocookie: true }),
    ],
    content: post?.content || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editor.getHTML();
    const payload = { title, slug, excerpt, content, coverImage, published, tags };
    const url = post ? `/api/posts/${post.id}` : '/api/posts';
    const method = post ? 'PUT' : 'POST';
    const res = await fetch(url, { method, body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    if (res.ok) router.push('/dashboard/posts');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-pink-200 dark:border-gray-700 shadow-lg animate-dramatic">
      <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
      <input required placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
      <input placeholder="Excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
      <input placeholder="Cover Image URL" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
      <input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-pink-500" /> Published
      </label>

      <div className="rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
        {editor && (
          <div className="flex flex-wrap items-center gap-2 mb-2 border-b border-pink-100 dark:border-gray-600 pb-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`text-sm px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-pink-200 dark:bg-pink-800' : 'hover:bg-pink-100 dark:hover:bg-pink-900'}`}><strong>B</strong></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`text-sm px-2 py-1 rounded italic ${editor.isActive('italic') ? 'bg-pink-200 dark:bg-pink-800' : 'hover:bg-pink-100 dark:hover:bg-pink-900'}`}><em>I</em></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`text-sm px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-pink-200 dark:bg-pink-800' : 'hover:bg-pink-100 dark:hover:bg-pink-900'}`}>H2</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`text-sm px-2 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-pink-200 dark:bg-pink-800' : 'hover:bg-pink-100 dark:hover:bg-pink-900'}`}>H3</button>
            <FontSizeSelector editor={editor} />
            <LinkButton editor={editor} />
            <ImageUploadButton editor={editor} />
            <FormatImageButton editor={editor} />
            <VideoButton editor={editor} />
            <span className="text-xs text-gray-400 ml-auto">Select image & use 🖼️</span>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      <button type="submit" className="btn-bubbly w-full py-3 text-lg">Save</button>
    </form>
  );
}