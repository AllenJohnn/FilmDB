import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbService';
import './MovieCard.css';

/**
 * MovieCard Component - Displays a single movie card with poster, title, rating, etc.
 * @param {Object} movie - Movie object from TMDB API
 * @param {String} viewMode - View mode ('grid' or 'compact')
 */
const MovieCard = ({ movie, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to movie details
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  // Get poster image URL
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  // Format vote average to one decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // Get rating color based on score
  const getRatingColor = (rating) => {
    if (rating >= 7) return '#4caf50'; // Green
    if (rating >= 5) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Extract release year
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  // Get original language (uppercase)
  const language = movie.original_language ? movie.original_language.toUpperCase() : 'N/A';

  return (
    <div className={`movie-card ${viewMode === 'compact' ? 'compact' : ''}`} onClick={handleClick}>
      {/* Movie Poster */}
      <div className="movie-card-image">
        <img src={posterUrl} alt={movie.title} loading="lazy" />
        
        {/* Rating Badge */}
        <div 
          className="movie-card-rating"
          style={{ backgroundColor: getRatingColor(movie.vote_average) }}
        >
          ⭐ {rating}
        </div>
      </div>

      {/* Movie Info */}
      <div className="movie-card-content">
        <h3 className="movie-card-title" title={movie.title}>
          {movie.title}
        </h3>

        <div className="movie-card-meta">
          <span className="movie-card-year">{releaseYear}</span>
          <span className="movie-card-separator">•</span>
          <span className="movie-card-language">{language}</span>
        </div>

        {viewMode !== 'compact' && (
          <p className="movie-card-overview">
            {movie.overview 
              ? movie.overview.substring(0, 100) + (movie.overview.length > 100 ? '...' : '')
              : 'No description available'}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
