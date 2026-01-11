import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../../components/Hero/Hero';
import ContentGrid from '../../components/ContentGrid/ContentGrid';
import { getTrending, getTopRated, getPopular, getGenres, discoverMovies } from '../../services/tmdbService';
import './NewHome.css';

const NewHome = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [contentType, setContentType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData || []);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setPage(1);
      try {
        let data;
        
        // If genre is selected, use discover API
        if (selectedGenre) {
          const mediaType = contentType === 'all' ? 'movie' : contentType;
          data = await discoverMovies({ 
            mediaType,
            genre: selectedGenre,
            page: 1 
          });
        } else {
          // Otherwise use trending/popular/top-rated
          if (activeTab === 'trending') {
            data = await getTrending(contentType === 'all' ? 'all' : contentType, 'week');
          } else if (activeTab === 'popular') {
            data = await getPopular(contentType === 'all' ? 'movie' : contentType, 1);
          } else if (activeTab === 'top-rated') {
            data = await getTopRated(contentType === 'all' ? 'movie' : contentType, 1);
          }
        }

        const processed = (data.results || [])
          .map(item => ({
            ...item,
            media_type: item.media_type || contentType
          }));
        
        setContent(processed);
        setHasMore((data.page || 1) < (data.total_pages || 2));
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeTab, contentType, selectedGenre]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoadingMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
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

  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'popular', label: 'Popular' },
    { id: 'top-rated', label: 'Top Rated' }
  ];

  const contentTypes = [
    { id: 'all', label: 'All' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' }
  ];

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      let data;

      if (selectedGenre) {
        const mediaType = contentType === 'all' ? 'movie' : contentType;
        data = await discoverMovies({ 
          mediaType,
          genre: selectedGenre,
          page: nextPage 
        });
      } else {
        if (activeTab === 'trending') {
          // Trending API doesn't support pagination, so use discover instead
          data = await discoverMovies({ 
            mediaType: contentType === 'all' ? 'movie' : contentType,
            page: nextPage 
          });
        } else if (activeTab === 'popular') {
          data = await getPopular(contentType === 'all' ? 'movie' : contentType, nextPage);
        } else if (activeTab === 'top-rated') {
          data = await getTopRated(contentType === 'all' ? 'movie' : contentType, nextPage);
        }
      }

      const newItems = (data.results || []).map(item => ({
        ...item,
        media_type: item.media_type || contentType
      }));

      // Filter out duplicates (items that already exist in content)
      const uniqueNewItems = newItems.filter(
        newItem => !content.some(existingItem => existingItem.id === newItem.id)
      );

      setContent(prev => [...prev, ...uniqueNewItems]);
      setPage(nextPage);
      setHasMore(nextPage < (data.total_pages || 2));
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <motion.div
      className="new-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      
      <div className="new-home-content">
        <div className="new-home-controls">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="filter-chips">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                className={`filter-chip ${contentType === type.id ? 'active' : ''}`}
                onClick={() => setContentType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="genre-filters">
            {genres.length > 0 && (
              <>
                <button
                  className={`genre-chip ${!selectedGenre ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(null)}
                >
                  All Genres
                </button>
                {genres.slice(0, 8).map((genre) => (
                  <button
                    key={genre.id}
                    className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${contentType}-${selectedGenre}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ContentGrid 
              content={content}
              loading={loading}
              title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} ${contentType === 'all' ? 'Content' : contentType === 'tv' ? 'TV Shows' : 'Movies'}`}
            />
            
            {isLoadingMore && (
              <div className="infinite-scroll-loader">
                <div className="loading-spinner" />
              </div>
            )}

            <div ref={sentinelRef} className="infinite-scroll-sentinel" />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NewHome;