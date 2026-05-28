import { useState, useEffect } from 'react';
import './SearchPage.css';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setAllUsers(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => setAllPosts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], posts: [] });
      return;
    }
    const q = query.toLowerCase();
    const matchedUsers = allUsers.filter(u =>
      u.username?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q)
    );
    const matchedPosts = allPosts.filter(p =>
      p.caption?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q)
    );
    setResults({ users: matchedUsers, posts: matchedPosts });
  }, [query, allUsers, allPosts]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Search</h2>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inner" />
          <input
            type="text"
            placeholder="Search users, posts, captions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="search-tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
          <button className={activeTab === 'people' ? 'active' : ''} onClick={() => setActiveTab('people')}>People</button>
          <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>Posts</button>
        </div>
      </div>

      <div className="search-results">
        {!query.trim() ? (
          <div className="search-empty">
            <Search size={48} opacity={0.2} />
            <p>Search for people, posts, and more</p>
          </div>
        ) : (
          <>
            {(activeTab === 'all' || activeTab === 'people') && results.users.length > 0 && (
              <div className="result-section">
                <h3>People</h3>
                {results.users.map(u => (
                  <div key={u.id} className="user-result">
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || u.username)}`} alt={u.username} />
                    <div>
                      <p className="res-username">{u.username}</p>
                      <p className="res-name">{u.fullName} · {u.role === 'faculty' ? 'Faculty 📚' : 'Student 🎓'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
              <div className="result-section">
                <h3>Posts</h3>
                <div className="posts-grid">
                  {results.posts.map(p => (
                    <div key={p.id} className="post-result">
                      <img src={p.imageUrl} alt={p.caption} />
                      <div className="post-result-caption">{p.caption}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.users.length === 0 && results.posts.length === 0 && (
              <div className="search-empty">
                <p>No results found for "<strong>{query}</strong>"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
