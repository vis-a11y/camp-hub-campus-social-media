import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error fetching posts", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts(currentPosts => 
      currentPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
  };

  return (
    <div className="feed-container">
      {posts.map(post => (
        <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
      ))}
    </div>
  );
};

export default Feed;
