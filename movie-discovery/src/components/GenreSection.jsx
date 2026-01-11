import { useState, useEffect } from 'react';
import { getGenres } from '../services/tmdbService';
import './GenreSection.css';

/**
 * GenreSection Component - Displays genre chips for quick filtering
 */
const GenreSection = ({ onGenreSelect, selectedGenre }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) return null;

  return (
    <div className="genre-section">
      <div className="genre-section-container">
        <h2 className="genre-section-title">
          <span className="genre-icon">🎭</span>
          Browse by Genre
        </h2>
        <div className="genre-chips-wrapper">
          <div className="genre-chips">
            <button
              className={`genre-chip ${!selectedGenre ? 'active' : ''}`}
              onClick={() => onGenreSelect('')}
            >
              <span className="chip-emoji">🌟</span>
              All Movies
            </button>

            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`genre-chip ${selectedGenre === genre.id.toString() ? 'active' : ''}`}
                onClick={() => onGenreSelect(genre.id.toString())}
              >
                <span className="chip-emoji">{getGenreEmoji(genre.name)}</span>
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getGenreEmoji = (genreName) => {
  const emojiMap = {
    'Action': '💥',
    'Adventure': '🗺️',
    'Animation': '🎨',
    'Comedy': '😂',
    'Crime': '🔫',
    'Documentary': '📽️',
    'Drama': '🎭',
    'Family': '👨‍👩‍👧‍👦',
    'Fantasy': '🧙',
    'History': '📜',
    'Horror': '👻',
    'Music': '🎵',
    'Mystery': '🔍',
    'Romance': '💕',
    'Science Fiction': '🚀',
    'TV Movie': '📺',
    'Thriller': '😱',
    'War': '⚔️',
    'Western': '🤠'
  };
  return emojiMap[genreName] || '🎬';
};

export default GenreSection;