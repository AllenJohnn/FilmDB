import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import GenreSection from '../components/GenreSection';
import ViewToggle from '../components/ViewToggle';
import StatsBar from '../components/StatsBar';
import ScrollToTop from '../components/ScrollToTop';
import MovieList from '../components/MovieList';
import { getPopularMovies, searchMovies, discoverMovies } from '../services/tmdbService';
import './Home.css';

/**
 * Home Component - Main page displaying movies with search, genre browse, and filter functionality
 */
const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'
  const [filters, setFilters] = useState({
    genre: '',
    language: '',
    year: '',
    rating: '',
  });

  // Fetch movies based on search query, genre, and filters (multiple pages for 60 movies)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let allMovies = [];
        
        // Fetch 3 pages to get 60 movies (20 per page)
        const pagesToFetch = [1, 2, 3];
        
        // Prepare filters with selected genre
        const effectiveFilters = {
          ...filters,
          genre: selectedGenre || filters.genre
        };
        
        const promises = pagesToFetch.map(page => {
          // If there's a search query, use search API
          if (searchQuery) {
            return searchMovies(searchQuery, page);
          }
          // If there are active filters or selected genre, use discover API
          else if (selectedGenre || Object.values(filters).some(value => value !== '')) {
            return discoverMovies(effectiveFilters, page);
          }
          // Otherwise, fetch popular movies
          else {
            return getPopularMovies(page);
          }
        });

        const results = await Promise.all(promises);
        
        // Combine all results
        results.forEach(data => {
          if (data.results) {
            allMovies = [...allMovies, ...data.results];
          }
        });

        setMovies(allMovies);
      } catch (err) {
        setError('Failed to fetch movies. Please check your API key in the .env file.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, filters, selectedGenre]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Clear filters and genre when searching
    if (query) {
      setFilters({
        genre: '',
        language: '',
        year: '',
        rating: '',
      });
      setSelectedGenre('');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Clear search and genre when filtering
    setSearchQuery('');
    setSelectedGenre('');
  };

  // Handle genre selection
  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    // Clear search and advanced filters when selecting genre
    setSearchQuery('');
    setFilters({
      genre: '',
      language: '',
      year: '',
      rating: '',
    });
  };

  // Get display title based on current mode
  const getDisplayTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (selectedGenre) {
      return 'Movies by Genre';
    }
    if (Object.values(filters).some(value => value !== '')) {
      return 'Filtered Movies';
    }
    return 'Popular Movies';
  };

  return (
    <div className="home">
      <Navbar onSearch={handleSearch} />
      
      <div className="home-content">
        {/* Genre Section - Only show when not searching */}
        {!searchQuery && (
          <GenreSection 
            onGenreSelect={handleGenreSelect}
            selectedGenre={selectedGenre}
          />
        )}

        {/* Page Header */}
        <div className="home-header">
          <div className="header-top">
            <div>
              <h1>{getDisplayTitle()}</h1>
              <p className="home-subtitle">
                {movies.length > 0 && `${movies.length} movies found`}
              </p>
            </div>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Filters - Only show when not in genre mode */}
        {!selectedGenre && (
          <Filters 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        )}

        {/* Stats Bar */}
        {!loading && movies.length > 0 && <StatsBar movies={movies} />}

        {/* Movie List */}
        <MovieList 
          movies={movies}
          loading={loading}
          error={error}
          viewMode={viewMode}
        />
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
