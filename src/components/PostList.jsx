import React, { useEffect, useState } from 'react';
import * as api from '../api/posts';
import PostForm from './PostForm';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPosts();
      setPosts(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(payload) {
    setError(null);
    try {
      const created = await api.createPost(payload);
      setPosts(prev => [created, ...prev]);
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    }
  }

  async function handleUpdate(id, payload) {
    setError(null);
    try {
      const updated = await api.updatePost(id, payload);
      setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setEditing(null);
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return;
    setError(null);
    try {
      await api.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  return (
    <div className="posts-grid">
      <div className="left">
        <div className="card">
          <h2>Create a Post</h2>
          <PostForm onSubmit={handleCreate} />
        </div>

        <div>
          {loading ? (
            <div className="card small">Loading posts...</div>
          ) : error ? (
            <div className="card error">Error: {error}</div>
          ) : posts.length === 0 ? (
            <div className="card small">No posts yet.</div>
          ) : (
            posts.map(post => (
              <article key={post.id} className="card">
                <div className="post-header">
                  <div>
                    <div className="post-author">{post.author || 'Anonymous'}</div>
                    <div className="small">{post.title || ''}</div>
                  </div>
                  <div className="small">{post.createdDate ? new Date(post.createdDate).toLocaleString() : ''}</div>
                </div>
                <div className="post-content">{post.content}</div>
                {post.imageUrl ? (
                  <div style={{marginTop:10}}>
                    <img src={post.imageUrl} alt="post" style={{maxWidth:'100%',borderRadius:6}} onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                ) : null}
                <div className="post-actions">
                  <button className="btn btn-ghost" onClick={() => setEditing(post)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="right">
        <div className="card">
          <h3>Editor</h3>
          {editing ? (
            <div>
              <PostForm initial={editing} onSubmit={(payload) => handleUpdate(editing.id, payload)} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div className="small">Select a post to edit.</div>
          )}
        </div>
        
      </div>
    </div>
  );
}