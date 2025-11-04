import React, { useState } from 'react';

export default function PostForm({ initial = null, onSubmit, onCancel }) {
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ author: author.trim() || null, title: title.trim() || null, content: content.trim() || null, imageUrl: imageUrl.trim() || null });
      if (!initial) {
        setAuthor(''); setTitle(''); setContent(''); setImageUrl('');
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label>Author</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" />
      </div>

      <div className="form-row">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title (optional)" />
      </div>

      <div className="form-row">
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something..."></textarea>
      </div>

      <div className="form-row">
        <label>Image URL</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div style={{display:'flex',gap:8,marginTop:8}}>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : (initial ? 'Update' : 'Create')}</button>
        {initial && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}