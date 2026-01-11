import MovieCard from './MovieCard';
import './MovieList.css';

/**
 * MovieList Component - Displays a grid of movie cards
 * @param {Array} movies - Array of movie objects
 * @param {Boolean} loading - Loading state
 * @param {String} error - Error message if any
 * @param {String} viewMode - View mode ('grid' or 'compact')
 */
const MovieList = ({ movies, loading, error, viewMode = 'grid' }) => {
  // Loading state
  if (loading) {
    return (
      <div className="movie-list-status">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="movie-list-status error">
        <p>❌ {error}</p>
        <p className="error-suggestion">Please check your API key and try again.</p>
      </div>
    );
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list-status">
        <p>🔍 No movies found</p>
        <p className="empty-suggestion">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Render movie grid
  return (
    <div className={`movie-list ${viewMode === 'compact' ? 'compact-view' : ''}`}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default MovieList;
