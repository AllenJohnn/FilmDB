import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ContentGrid from '../../components/ContentGrid/ContentGrid';
import { multiSearch, searchMovies, searchTVShows, discoverMovies } from '../../services/tmdbService';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useMemo(() => (searchParams.get('q') || '').trim(), [searchParams]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    rating: '',
    genre: '',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const runSearch = async () => {
      if (!query && !filters.year && !filters.rating && !filters.genre) {
        setResults([]);
        setError('');
        return;
      }
      setLoading(true);
      setError('');
      setPage(1);
      try {
        let combined = [];
        
        // If there are active filters, use discover instead of search
        if (filters.year || filters.rating || filters.genre) {
          const discoverData = await discoverMovies({
            year: filters.year || undefined,
            rating: filters.rating || undefined,
            genre: filters.genre || undefined
          }, 1);
          combined = discoverData.results || [];
          setHasMore((discoverData.page || 1) < (discoverData.total_pages || 2));
        } else if (query) {
          // Original search logic
          try {
            const data = await multiSearch(query, 1);
            combined = (data.results || []).filter(i => i.media_type === 'movie' || i.media_type === 'tv');
          } catch (_) {
            combined = [];
          }

          if (!combined || combined.length === 0) {
            const [m, t] = await Promise.all([searchMovies(query, 1), searchTVShows(query, 1)]);
            combined = [
              ...(m.results || []).map(x => ({ ...x, media_type: 'movie' })),
              ...(t.results || []).map(x => ({ ...x, media_type: 'tv' }))
            ];
          }
          setHasMore(combined.length > 0);
        }

        setResults(combined);
      } catch (err) {
        console.error('Search failed', err);
        setError('Something went wrong while searching.');
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query, filters]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoadingMore || loading || (!query && !filters.year && !filters.rating && !filters.genre)) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreResults();
        }
      },
      { rootMargin: '300px', threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoadingMore, loading]);

  const loadMoreResults = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      let newItems = [];
      let totalPages = 1;

      if (filters.year || filters.rating || filters.genre) {
        const discoverData = await discoverMovies({
          year: filters.year || undefined,
          rating: filters.rating || undefined,
          genre: filters.genre || undefined
        }, nextPage);
        newItems = discoverData.results || [];
        totalPages = discoverData.total_pages || 2;
      } else if (query) {
        try {
          const data = await multiSearch(query, nextPage);
          newItems = (data.results || []).filter(i => i.media_type === 'movie' || i.media_type === 'tv');
        } catch (_) {
          newItems = [];
        }

        if (!newItems || newItems.length === 0) {
          const [m, t] = await Promise.all([searchMovies(query, nextPage), searchTVShows(query, nextPage)]);
          newItems = [
            ...(m.results || []).map(x => ({ ...x, media_type: 'movie' })),
            ...(t.results || []).map(x => ({ ...x, media_type: 'tv' }))
          ];
        }
      }

      // Filter out duplicates
      const uniqueNewItems = newItems.filter(
        newItem => !results.some(existingItem => existingItem.id === newItem.id)
      );

      setResults(prev => [...prev, ...uniqueNewItems]);
      setPage(nextPage);
      setHasMore(nextPage < totalPages);
    } catch (error) {
      console.error('Failed to load more results:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleClear = () => {
    navigate('/');
    setFilters({ year: '', rating: '', genre: '' });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const hasActiveFilters = filters.year || filters.rating || filters.genre;

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="search-hero-inner">
          <div>
            <motion.p
              className="search-kicker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              Search results
            </motion.p>
            <motion.h1
              className="search-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {query ? `“${query}”` : 'Find movies and series'}
            </motion.h1>
            <p className="search-subtitle">
              Browse both films and TV with English-first relevance. Use the top bar to try another search.
            </p>
          </div>
          {query && (
            <button className="search-clear" onClick={handleClear}>
              Back to home
            </button>
          )}
        </div>
      </div>

      <div className="search-results">
        {error && <div className="search-error">{error}</div>}
        {!query && !loading && <div className="search-empty">Type a title above to get started.</div>}
        {query && !loading && results.length === 0 && !error && (
          <div className="search-empty">No results found for “{query}”.</div>
        )}

        <ContentGrid
          content={results}
          loading={loading}
          title={query ? `Matches for “${query}”` : ''}
        />
        {isLoadingMore && (
          <div className="infinite-scroll-loader">
            <div className="loading-spinner" />
          </div>
        )}

        <div ref={sentinelRef} className="infinite-scroll-sentinel" />      </div>
    </div>
  );
};

export default Search;
