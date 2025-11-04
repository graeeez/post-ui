import React from 'react';
import PostList from './components/PostList';

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Mini Facebook — Posts</h1>
        <p className="subtitle">Create, edit, and delete posts (connected to http://localhost:8080)</p>
      </header>

      <main>
        <PostList />
      </main>

      <footer>
      
      </footer>
    </div>
  );
}