import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLikes } from '../../context/LikesContext';
import { useWatchList } from '../../context/WatchListContext';
import { useCollections } from '../../context/CollectionsContext';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const { likedContent } = useLikes();
  const { watchList } = useWatchList();
  const { collections } = useCollections();

  const stats = useMemo(() => {
    const movies = likedContent.filter(c => c.media_type === 'movie');
    const tvShows = likedContent.filter(c => c.media_type === 'tv');
    const watchListMovies = watchList.filter(c => c.media_type === 'movie');
    const watchListShows = watchList.filter(c => c.media_type === 'tv');

    // Calculate average rating
    const avgRating = likedContent.length > 0
      ? (likedContent.reduce((sum, c) => sum + (c.vote_average || 0), 0) / likedContent.length).toFixed(1)
      : 0;

    // Get top genres
    const genreCount = {};
    likedContent.forEach(c => {
      if (c.genres) {
        c.genres.forEach(g => {
          genreCount[g.name] = (genreCount[g.name] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Get collection stats
    const collectionItems = collections.reduce((sum, c) => sum + c.items.length, 0);

    return {
      totalLikes: likedContent.length,
      movies: movies.length,
      tvShows: tvShows.length,
      watchListTotal: watchList.length,
      watchListMovies: watchListMovies.length,
      watchListShows: watchListShows.length,
      avgRating,
      topGenres,
      collectionItems
    };
  }, [likedContent, watchList, collections]);

  const StatCard = ({ icon, label, value, subtext }) => (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        {subtext && <p className="stat-subtext">{subtext}</p>}
      </div>
    </motion.div>
  );

  const HeartIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );

  const FolderIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );

  return (
    <motion.div
      className="analytics-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="analytics-header">
        <h1>Your Stats</h1>
        <p>Track your movie and TV show discovery journey</p>
      </div>

      <div className="analytics-container">
        {/* Main Stats */}
        <div className="stats-grid">
          <StatCard
            icon={<HeartIcon />}
            label="Total Likes"
            value={stats.totalLikes}
            subtext={`${stats.movies} movies • ${stats.tvShows} shows`}
          />
          <StatCard
            icon={<ClockIcon />}
            label="Watch List"
            value={stats.watchListTotal}
            subtext={`${stats.watchListMovies} movies • ${stats.watchListShows} shows`}
          />
          <StatCard
            icon={<StarIcon />}
            label="Average Rating"
            value={stats.avgRating}
            subtext="Of your liked items"
          />
          <StatCard
            icon={<FolderIcon />}
            label="Collections"
            value={collections.length}
            subtext={`${stats.collectionItems} total items`}
          />
        </div>

        {/* Top Genres */}
        {stats.topGenres.length > 0 && (
          <motion.div
            className="analytics-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Your Top Genres</h2>
            <div className="genres-list">
              {stats.topGenres.map(([genre, count], index) => (
                <div key={genre} className="genre-item">
                  <div className="genre-rank">{index + 1}</div>
                  <span className="genre-name">{genre}</span>
                  <div className="genre-bar">
                    <motion.div
                      className="genre-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(count / stats.topGenres[0][1]) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="genre-count">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Facts */}
        <motion.div
          className="analytics-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Quick Facts</h2>
          <div className="facts-list">
            <div className="fact-item">
              <div className="fact-icon movie-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                  <line x1="7" y1="2" x2="7" y2="22"/>
                  <line x1="17" y1="2" x2="17" y2="22"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <line x1="2" y1="7" x2="7" y2="7"/>
                  <line x1="2" y1="17" x2="7" y2="17"/>
                  <line x1="17" y1="17" x2="22" y2="17"/>
                  <line x1="17" y1="7" x2="22" y2="7"/>
                </svg>
              </div>
              <span className="fact-text">
                {stats.movies === 0 ? 'No movies liked yet' : `You love ${stats.movies > 1 ? 'movies' : 'a movie'}!`}
              </span>
            </div>
            <div className="fact-item">
              <div className="fact-icon tv-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 7l-7 5 7 5V7z"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <span className="fact-text">
                {stats.tvShows === 0 ? 'No TV shows liked yet' : `${stats.tvShows} TV ${stats.tvShows === 1 ? 'show' : 'shows'} in your collection`}
              </span>
            </div>
            <div className="fact-item">
              <div className="fact-icon watchlist-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="fact-text">
                {stats.watchListTotal === 0 ? 'Add items to your watch list' : `${stats.watchListTotal} ${stats.watchListTotal === 1 ? 'item' : 'items'} waiting to watch`}
              </span>
            </div>
            <div className="fact-item">
              <div className="fact-icon genre-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span className="fact-text">
                {stats.topGenres.length > 0 ? `Your favorite genre is ${stats.topGenres[0][0]}` : 'Like some content to see your favorite genres!'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
