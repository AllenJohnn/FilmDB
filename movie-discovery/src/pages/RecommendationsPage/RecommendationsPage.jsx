import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLikes } from '../../context/LikesContext';
import { getPersonalizedRecommendations } from '../../services/tmdbService';
import ContentGrid from '../../components/ContentGrid/ContentGrid';
import './RecommendationsPage.css';

const RecommendationsPage = () => {
  const { likedContent, getLikeStats } = useLikes();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (likedContent.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const stats = getLikeStats();
        const data = await getPersonalizedRecommendations(stats);
        setRecommendations(data.results);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [likedContent, getLikeStats]);

  return (
    <motion.div
      className="recommendations-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="recommendations-page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="recommendations-page-title">
            <span className="recommendations-icon">✨</span>
            For You
          </h1>
          <p className="recommendations-page-subtitle">
            {likedContent.length === 0
              ? 'Like some content to get personalized recommendations'
              : `Personalized picks based on your ${likedContent.length} liked item${likedContent.length !== 1 ? 's' : ''}`
            }
          </p>
        </motion.div>
      </div>

      <div className="recommendations-page-content">
        {likedContent.length === 0 ? (
          <motion.div 
            className="recommendations-page-empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">🎯</div>
            <h3>Start building your taste profile</h3>
            <p>Like movies and TV shows to get smart recommendations tailored just for you!</p>
          </motion.div>
        ) : (
          <ContentGrid 
            content={recommendations}
            loading={loading}
            title="🎬 Recommended For You"
          />
        )}
      </div>
    </motion.div>
  );
};

export default RecommendationsPage;