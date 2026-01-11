import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovieDetails, getTVShowDetails, getImageUrl, getSimilarMovies, getSimilarTVShows } from '../services/tmdbService';
import { useWatchList } from '../context/WatchListContext';
import { useRecentlyWatched } from '../context/RecentlyWatchedContext';
import { useUserRatings } from '../context/UserRatingsContext';
import LikeButton from '../components/LikeButton/LikeButton';
import ContentCard from '../components/ContentCard/ContentCard';
import TrailerModal from '../components/TrailerModal/TrailerModal';
import SimilarContent from '../components/SimilarContent/SimilarContent';
import './ContentDetails.css';

const ContentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInWatchList, toggleWatchList } = useWatchList();
  const { addWatched } = useRecentlyWatched();
  const { getRating, setRating } = useUserRatings();
  const [content, setContent] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const mediaType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailsData, similarData] = await Promise.all([
          mediaType === 'tv' ? getTVShowDetails(id) : getMovieDetails(id),
          mediaType === 'tv' ? getSimilarTVShows(id) : getSimilarMovies(id)
        ]);
        
        setContent({ ...detailsData, media_type: mediaType });
        setSimilar(similarData.results.slice(0, 12).map(item => ({ ...item, media_type: mediaType })));
        addWatched({ ...detailsData, media_type: mediaType });
        setUserRating(getRating(id) || 0);
      } catch (error) {
        console.error('Failed to fetch details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, mediaType, addWatched, getRating]);

  if (loading) {
    return (
      <div className="content-details-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-details-error">
        <h2>Content not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const title = content.title || content.name;
  const releaseDate = content.release_date || content.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const runtime = content.runtime || (content.episode_run_time && content.episode_run_time[0]) || null;
  const cast = content.credits?.cast?.slice(0, 10) || [];
  const trailer = content.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const handleRatingChange = (rating) => {
    setUserRating(rating);
    setRating(id, rating);
  };

  return (
    <motion.div
      className="content-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-details-hero">
        <div className="content-details-backdrop">
          <img src={getImageUrl(content.backdrop_path, 'original')} alt={title} />
          <div className="content-details-gradient" />
        </div>

        <div className="content-details-content">
          <motion.button
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </motion.button>

          <div className="content-details-info-wrapper">
            <motion.div
              className="content-details-poster"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img src={getImageUrl(content.poster_path, 'w500')} alt={title} />
            </motion.div>

            <motion.div
              className="content-details-info"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="content-details-badge">
                {mediaType === 'tv' ? '📺 TV Show' : '🎬 Movie'}
              </div>

              <h1 className="content-details-title">{title}</h1>

              <div className="content-details-meta">
                <span className="meta-rating">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {content.vote_average?.toFixed(1)}
                </span>
                <span className="meta-separator">•</span>
                <span>{year}</span>
                {runtime && (
                  <>
                    <span className="meta-separator">•</span>
                    <span>{runtime} min</span>
                  </>
                )}
                {mediaType === 'tv' && content.number_of_seasons && (
                  <>
                    <span className="meta-separator">•</span>
                    <span>{content.number_of_seasons} Season{content.number_of_seasons !== 1 ? 's' : ''}</span>
                  </>
                )}
              </div>

              <div className="content-details-genres">
                {content.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>

              <p className="content-details-overview">{content.overview}</p>

              <div className="content-details-actions">
                {trailer && (
                  <motion.button
                    className="action-btn action-btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTrailerOpen(true)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Trailer
                  </motion.button>
                )}
                
                <motion.button
                  className={`action-btn action-btn-secondary ${isInWatchList(content.id, mediaType) ? 'active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWatchList({ ...content, media_type: mediaType })}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWatchList(content.id, mediaType) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {isInWatchList(content.id, mediaType) ? 'In Watch List' : 'Add to Watch List'}
                </motion.button>
                
                <LikeButton content={content} size="large" />
              </div>

              <div className="content-details-user-rating">
                <p className="user-rating-label">Your Rating:</p>
                <div className="user-rating-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                    <button
                      key={star}
                      className={`rating-star ${userRating >= star ? 'active' : ''}`}
                      onClick={() => handleRatingChange(star)}
                      title={`${star}/10`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {content.tagline && (
                <p className="content-details-tagline">"{content.tagline}"</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <div className="content-details-section">
          <h2 className="section-title">Cast</h2>
          <div className="cast-grid">
            {cast.map((actor) => (
              <motion.div
                key={actor.id}
                className="cast-card"
                whileHover={{ y: -8 }}
              >
                <img
                  src={actor.profile_path ? getImageUrl(actor.profile_path, 'w185') : 'https://via.placeholder.com/185x278?text=No+Photo'}
                  alt={actor.name}
                />
                <div className="cast-info">
                  <h4>{actor.name}</h4>
                  <p>{actor.character}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <SimilarContent id={id} mediaType={mediaType} />

      <TrailerModal
        isOpen={trailerOpen}
        trailer={trailer}
        onClose={() => setTrailerOpen(false)}
        title={title}
      />
    </motion.div>
  );
};

export default ContentDetails;