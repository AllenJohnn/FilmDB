import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdbService';
import LazyImage from '../LazyImage/LazyImage';
import LikeButton from '../LikeButton/LikeButton';
import CollectionQuickAdd from '../CollectionQuickAdd/CollectionQuickAdd';
import './ContentCard.css';

const ContentCard = ({ content, index = 0 }) => {
  const navigate = useNavigate();
  const [showCollections, setShowCollections] = useState(false);
  
  const title = content.title || content.name;
  const releaseDate = content.release_date || content.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const mediaType = content.media_type || 'movie';
  
  const rating = content.vote_average?.toFixed(1) || 'N/A';
  const ratingColor = 
    rating >= 8 ? '#44e4b1' :
    rating >= 7 ? '#f3c14b' :
    rating >= 6 ? '#ff7ab5' :
    '#ff5d5d';

  const handleClick = () => {
    navigate(`/${mediaType}/${content.id}`);
  };

  const handleCollectionClick = (e) => {
    e.stopPropagation();
    setShowCollections(!showCollections);
  };

  return (
    <motion.div
      className="content-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={handleClick}
    >
      <div className="content-card-image">
        <LazyImage
          src={getImageUrl(content.poster_path, 'w500')}
          dataSrc={getImageUrl(content.poster_path, 'w500')}
          alt={title}
        />
        <div className="content-card-overlay">
          <div className="content-card-actions">
            <LikeButton content={{ ...content, media_type: mediaType }} />
            <div className="action-button-wrapper" onClick={handleCollectionClick}>
              <button className="action-button" title="Add to collection">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </button>
              <AnimatePresence>
                {showCollections && (
                  <CollectionQuickAdd item={content} onClose={() => setShowCollections(false)} />
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.div 
            className="content-card-info"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="content-card-overview">
              {content.overview || 'No description available.'}
            </p>
          </motion.div>
        </div>
        <div className="content-card-badge">
          {mediaType === 'tv' ? 'Series' : 'Film'}
        </div>
      </div>
      
      <div className="content-card-details">
        <h3 className="content-card-title">{title}</h3>
        <div className="content-card-meta">
          <span className="content-card-year">{year}</span>
          <span 
            className="content-card-rating"
            style={{ '--rating-color': ratingColor }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;