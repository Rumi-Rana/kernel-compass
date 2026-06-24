'use client';
import { useSession } from 'next-auth/react';
import { useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import YoutubeExtension from '@tiptap/extension-youtube';
import { Mark, Node } from '@tiptap/core';
import toast, { Toaster } from 'react-hot-toast';

/* ---------- Custom FontSize Mark ---------- */
const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  parseHTML() { return [{ style: 'font-size' }]; },
  renderHTML({ HTMLAttributes }) { return ['span', HTMLAttributes, 0]; },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => chain().setMark('fontSize', { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => chain().unsetMark('fontSize').run(),
    };
  },
});

/* ---------- Custom Image (width/height + alignment) ---------- */
const CustomImage = Node.create({
  name: 'image',
  group: 'inline',
  inline: true,
  draggable: true,
  addAttributes() {
    return {
      src: {},
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      align: { default: 'left' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom) => ({
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          title: dom.getAttribute('title'),
          width: dom.getAttribute('width') || dom.style.width,
          height: dom.getAttribute('height') || dom.style.height,
          align: dom.getAttribute('data-align') || dom.style.textAlign || 'left',
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { width, height, align, ...rest } = HTMLAttributes;
    const style = [];
    if (width) style.push(`width: ${width}`);
    if (height) style.push(`height: ${height}`);
    if (align === 'center') {
      style.push('display: block', 'margin-left: auto', 'margin-right: auto');
    } else if (align === 'right') {
      style.push('float: right', 'margin-left: 1rem');
    } else {
      style.push('float: left', 'margin-right: 1rem');
    }
    return ['img', { ...rest, style: style.join('; '), 'data-align': align }];
  },
  addCommands() {
    return {
      setImage: (attrs) => ({ chain }) => chain().insertContent({ type: 'image', attrs }).run(),
    };
  },
});

/* ---------- Toolbar Buttons ---------- */
function ImageUploadButton({ editor }) {
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    if (url) editor.chain().focus().setImage({ src: url }).run();
    else toast.error('Upload failed');
  };
  return (
    <label className="cursor-pointer text-sm text-pink-600 hover:text-pink-800">
      📷
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </label>
  );
}

function LinkButton({ editor }) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);
  return (
    <button onClick={setLink} className={`text-sm px-2 py-1 rounded ${editor.isActive('link') ? 'bg-pink-200 dark:bg-pink-800' : 'hover:bg-pink-100 dark:hover:bg-pink-900'}`} title="Link">🔗</button>
  );
}

function FontSizeSelector({ editor }) {
  const sizes = ['12px','14px','16px','18px','20px','24px','28px','36px'];
  const current = editor.getAttributes('fontSize').fontSize || '16px';
  return (
    <select value={current} onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()} className="text-sm bg-white dark:bg-gray-700 border border-pink-200 dark:border-gray-600 rounded px-2 py-1">
      {sizes.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function VideoButton({ editor }) {
  const addVideo = () => {
    const url = window.prompt('YouTube URL');
    if (url) editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  };
  return <button onClick={addVideo} className="text-sm px-2 py-1 rounded hover:bg-pink-100 dark:hover:bg-pink-900" title="Video">🎬</button>;
}

/* ---------- Combined Format Image Button (resize + alignment) ---------- */
function FormatImageButton({ editor }) {
  const handleFormat = () => {
    const { from, to } = editor.state.selection;
    let node = null, pos = null;
    editor.state.doc.nodesBetween(from, to, (n, p) => {
      if (n.type.name === 'image') { node = n; pos = p; return false; }
    });
    if (!node) { alert('Click on the image first, then use this button.'); return; }

    const curWidth = node.attrs.width || '';
    const curAlign = node.attrs.align || 'left';
    const input = window.prompt(
      `Enter width (e.g., 400px or 50%) and alignment (left, center, right)\nExample: 300px, center\n\nCurrent: ${curWidth || 'auto'}, ${curAlign}`,
      `${curWidth || ''}, ${curAlign}`
    );
    if (!input) return;

    const parts = input.split(',').map(s => s.trim());
    const newWidth = parts[0] || null;
    const newAlign = parts[1]?.toLowerCase() || curAlign;
    const allowed = ['left', 'center', 'right'];
    if (!allowed.includes(newAlign)) {
      alert('Alignment must be left, center, or right.');
      return;
    }

    editor.chain().focus().setNodeSelection(pos).updateAttributes('image', {
      width: newWidth || null,
      align: newAlign,
    }).run();
  };

  return (
    <button onClick={handleFormat} className="text-sm px-2 py-1 rounded hover:bg-pink-100 dark:hover:bg-pink-900" title="Resize & Align Image">
      🖼️
    </button>
  );
}

/* ---------- Main Create Form ---------- */
function CreateForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'BLOG';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState(initialType);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      LinkExtension.configure({ openOnClick: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: 'Write your story...' }),
      FontSize,
      YoutubeExtension.configure({ controls: true, nocookie: true }),
    ],
    content: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !editor?.getHTML()) {
      toast.error('Title, slug, and content are required');
      return;
    }
    setSubmitting(true);
    const payload = {
      title,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      content: editor.getHTML(),
      type,
      visibility,
      mood: type === 'VENT' ? mood : null,
      tags,
      coverImage,
      published: true,
    };

    const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success('Post published!');
      router.push(`/post/${payload.slug}`);
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to publish');
    }
    setSubmitting(false);
  };

  if (!session) return <div className="p-8 text-center">Please sign in to create a post.</div>;

  const moodOptions = ['Angry', 'Sad', 'Frustrated', 'Overwhelmed', 'Anxious', 'Lonely', 'Exhausted', 'Other'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <Toaster />
      <div className="max-w-3xl w-full p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200 dark:border-gray-700 animate-dramatic">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-6">Create a Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post type, visibility, title, slug, mood, cover image, tags – same as before */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Post Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none">
              <option value="BLOG">📝 Blog Article</option>
              <option value="VENT">😤 Vent</option>
              <option value="MOTIVATION">💪 Motivation / Achievement</option>
              <option value="EXPERIENCE">🌍 Share Experience</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Who can see this?</label>
            <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none">
              <option value="PUBLIC">🌍 Everyone (Public)</option>
              <option value="FOLLOWERS">🔒 Followers only</option>
            </select>
          </div>
          <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          <input required placeholder="Slug (e.g., my-story)" value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          {type === 'VENT' && (
            <div>
              <label className="block mb-1 font-medium">Mood</label>
              <select value={mood} onChange={e => setMood(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none">
                <option value="">Select mood...</option>
                {moodOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
          <input placeholder="Cover image URL (optional)" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />
          <input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-3 rounded-xl border border-pink-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-400 outline-none" />

          {/* Editor Toolbar */}
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

          <button type="submit" disabled={submitting} className="btn-bubbly w-full py-3 text-lg">
            {submitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CreateForm />
    </Suspense>
  );
}