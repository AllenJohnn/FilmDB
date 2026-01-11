import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecommendations } from '../../services/tmdbService';
import LazyImage from '../LazyImage/LazyImage';
import './SimilarContent.css';

const SimilarContent = ({ id, mediaType }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const data = await getRecommendations(mediaType, id);
        setSimilar((data.results || []).slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch similar:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [id, mediaType]);

  if (loading || similar.length === 0) return null;

  return (
    <motion.div
      className="similar-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3>Similar {mediaType === 'movie' ? 'Movies' : 'Shows'}</h3>
      <div className="similar-grid">
        {similar.map((item, idx) => (
          <Link
            key={item.id}
            to={`/${mediaType}/${item.id}`}
            className="similar-card"
            as={motion.a}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {item.poster_path && (
              <LazyImage
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title || item.name}
              />
            )}
            <div className="similar-card-title">{item.title || item.name}</div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default SimilarContent;
