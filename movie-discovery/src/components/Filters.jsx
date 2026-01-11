import { useState, useEffect } from 'react';
import { getGenres } from '../services/tmdbService';
import './Filters.css';

/**
 * Filters Component - Provides filtering options for movies
 * @param {Function} onFilterChange - Callback when filters are updated
 * @param {Object} currentFilters - Current filter values
 */
const Filters = ({ onFilterChange, currentFilters }) => {
  const [genres, setGenres] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...currentFilters,
      [filterType]: value,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      genre: '',
      language: '',
      year: '',
      rating: '',
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(currentFilters).some(value => value !== '');

  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Common languages for movies
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' },
  ];

  // Rating options
  const ratings = [
    { value: 7, label: '7+ ⭐⭐⭐' },
    { value: 6, label: '6+ ⭐⭐' },
    { value: 5, label: '5+ ⭐' },
  ];

  return (
    <div className="filters-container">
      <button 
        className="filters-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        🎛️ Filters {hasActiveFilters && <span className="filter-badge">{Object.values(currentFilters).filter(v => v).length}</span>}
      </button>

      <div className={`filters ${isOpen ? 'filters-open' : ''}`}>
        <div className="filters-header">
          <h3>Filters</h3>
          {hasActiveFilters && (
            <button className="clear-filters" onClick={handleClearFilters}>
              Clear All
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Genre Filter */}
          <div className="filter-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              value={currentFilters.genre || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="filter-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={currentFilters.language || ''}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="filter-group">
            <label htmlFor="year">Release Year</label>
            <select
              id="year"
              value={currentFilters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <label htmlFor="rating">Minimum Rating</label>
            <select
              id="rating"
              value={currentFilters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">All Ratings</option>
              {ratings.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
