import { useState, useEffect } from 'react';
import './DiscoverPage.css';

const DiscoverPage = () => {
  const [discoverImages, setDiscoverImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => {
        // Extract just the image URLs for the discover grid
        const images = data.map(post => post.imageUrl);
        setDiscoverImages(images);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="discover-container">
      <div className="discover-grid">
        {discoverImages.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: 'var(--secondary-text)' }}>
            No posts found. Be the first to post!
          </p>
        ) : (
          discoverImages.map((img, i) => (
            <div key={i} className="discover-item">
              <img src={img} alt={`Discover ${i}`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
