import { motion } from 'framer-motion';
import ContentCard from '../ContentCard/ContentCard';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import './ContentGrid.css';

const ContentGrid = ({ content, loading, title }) => {
  if (loading && (!content || content.length === 0)) {
    return (
      <div className="content-grid-section">
        {title && <h2 className="content-grid-title">{title}</h2>}
        <div className="content-grid">
          {[...Array(12)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="content-grid-section">
        {title && <h2 className="content-grid-title">{title}</h2>}
        <div className="content-grid-empty">
          <p>No content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-grid-section">
      {title && (
        <motion.h2 
          className="content-grid-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}
      <div className="content-grid">
        {content.map((item, index) => (
          <ContentCard key={`${item.id}-${item.media_type || 'movie'}`} content={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ContentGrid;