import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getTrending, getImageUrl } from '../../services/tmdbService';
import LikeButton from '../LikeButton/LikeButton';
import './Hero.css';

const SLIDE_INTERVAL = 6500;
const MAX_SLIDES = 8;

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch a pool of trending items so the hero can rotate between them
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getTrending('all', 'day');
        const ranked = data.results
          .filter(item => item.backdrop_path)
          .slice(0, MAX_SLIDES)
          .map(item => ({
            ...item,
            media_type: item.media_type || 'movie'
          }));
        setSlides(ranked);
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Auto-play
  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = useMemo(() => slides[active], [slides, active]);

  if (loading || !current) {
    return (
      <div className="hero-skeleton">
        <div className="hero-skeleton-content" />
      </div>
    );
  }

  const title = current.title || current.name;
  const mediaType = current.media_type || 'movie';
  const year = new Date(current.release_date || current.first_air_date).getFullYear();
  const rating = current.vote_average ? current.vote_average.toFixed(1) : 'N/A';

  const handleNavigate = () => navigate(`/${mediaType}/${current.id}`);

  const goPrev = () => setActive(prev => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActive(prev => (prev + 1) % slides.length);

  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hero-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="hero-backdrop"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            style={{ backgroundImage: `url(${getImageUrl(current.backdrop_path, 'original')})` }}
          />
        </AnimatePresence>
        <div className="hero-gradient" />
        <div className="hero-noise" />
      </div>

      <div className="hero-content">
        <div className="hero-header">
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            {mediaType === 'tv' ? 'Series spotlight' : 'Film spotlight'}
          </div>
          <div className="hero-controls">
            <button className="hero-nav" onClick={goPrev} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="hero-nav" onClick={goNext} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hero-body">
          <div className="hero-text">
            <AnimatePresence mode="wait">
              <motion.h1
                key={current.id}
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {title}
              </motion.h1>
            </AnimatePresence>

            <div className="hero-meta">
              <span className="hero-chip rating">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {rating}
              </span>
              <span className="hero-dot" />
              <span className="hero-chip subtle">{year}</span>
              <span className="hero-dot" />
              <span className="hero-chip subtle">{mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
            </div>

            <p className="hero-overview">{current.overview}</p>

            <div className="hero-actions">
              <motion.button
                className="hero-btn hero-btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNavigate}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Details
              </motion.button>

              <LikeButton content={{ ...current, media_type: mediaType }} size="large" />
            </div>
          </div>

          <div className="hero-rail">
            <div className="hero-progress">
              <div
                key={active}
                className="hero-progress-bar"
                style={{ animationDuration: `${SLIDE_INTERVAL}ms` }}
              />
            </div>

            <div className="hero-thumbs">
              {slides.map((item, idx) => (
                <button
                  key={item.id}
                  className={`hero-thumb ${idx === active ? 'active' : ''}`}
                  onClick={() => setActive(idx)}
                  aria-label={`Show ${item.title || item.name}`}
                >
                  <img src={getImageUrl(item.backdrop_path, 'w300')} alt={item.title || item.name} loading="lazy" />
                  <div className="hero-thumb-overlay" />
                  <span className="hero-thumb-title">{item.title || item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;