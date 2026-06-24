'use client';

export default function ResizeImageButton({ editor }) {
  const handleResize = () => {
    // Find the currently selected image
    const { from, to } = editor.state.selection;
    let imageNode = null;
    let pos = null;

    editor.state.doc.nodesBetween(from, to, (node, nodePos) => {
      if (node.type.name === 'image') {
        imageNode = node;
        pos = nodePos;
        return false; // stop at first image
      }
    });

    if (!imageNode) {
      alert('Please select an image first.');
      return;
    }

    const currentWidth = imageNode.attrs.width || '';
    const newWidth = window.prompt(
      'Enter image width (e.g., 400px or 50%). Leave empty to auto‑size.',
      currentWidth
    );

    if (newWidth === null) return; // cancelled

    // Update the image node’s width attribute
    editor
      .chain()
      .focus()
      .setNodeSelection(pos)
      .updateAttributes('image', { width: newWidth || null })
      .run();
  };

  return (
    <button
      onClick={handleResize}
      className="text-sm px-2 py-1 rounded hover:bg-pink-100 dark:hover:bg-pink-900"
      title="Set image size"
    >
      ↔️
    </button>
  );
}