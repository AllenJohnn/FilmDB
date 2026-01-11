import { motion } from 'framer-motion';
import { useLikes } from '../../context/LikesContext';
import ContentGrid from '../../components/ContentGrid/ContentGrid';
import './LikedPage.css';

const LikedPage = () => {
  const { likedContent, getLikedByType } = useLikes();

  const likedMovies = getLikedByType('movie');
  const likedTV = getLikedByType('tv');

  return (
    <motion.div
      className="liked-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="liked-page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="liked-page-title">
            <span className="liked-icon">💖</span>
            My Collection
          </h1>
          <p className="liked-page-subtitle">
            {likedContent.length === 0 
              ? 'Start liking content to build your personal collection'
              : `${likedContent.length} item${likedContent.length !== 1 ? 's' : ''} in your collection`
            }
          </p>
        </motion.div>
      </div>

      <div className="liked-page-content">
        {likedContent.length === 0 ? (
          <motion.div 
            className="liked-page-empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">💔</div>
            <h3>No liked content yet</h3>
            <p>Explore movies and TV shows and start building your collection!</p>
          </motion.div>
        ) : (
          <>
            {likedMovies.length > 0 && (
              <ContentGrid 
                content={likedMovies}
                loading={false}
                title="🎬 Liked Movies"
              />
            )}
            
            {likedTV.length > 0 && (
              <ContentGrid 
                content={likedTV}
                loading={false}
                title="📺 Liked TV Shows"
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LikedPage;