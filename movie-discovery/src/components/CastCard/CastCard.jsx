import { motion } from 'framer-motion';
import { getImageUrl } from '../../services/tmdbService';
import './CastCard.css';

const CastCard = ({ cast, index = 0 }) => {
  if (!cast) return null;

  return (
    <motion.div
      className="cast-card"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="cast-image">
        {cast.profile_path ? (
          <img
            src={getImageUrl(cast.profile_path, 'w200')}
            alt={cast.name}
            loading="lazy"
          />
        ) : (
          <div className="cast-image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="cast-info">
        <h4 className="cast-name">{cast.name}</h4>
        <p className="cast-character">{cast.character || 'Character N/A'}</p>
      </div>
    </motion.div>
  );
};

export default CastCard;
