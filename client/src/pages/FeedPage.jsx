import StoriesBar from '../components/Stories/StoriesBar';
import Feed from '../components/Feed/Feed';

const FeedPage = () => {
  return (
    <div style={{ maxWidth: '630px', width: '100%', padding: '0 15px' }}>
      <StoriesBar />
      <Feed />
    </div>
  );
};

export default FeedPage;
