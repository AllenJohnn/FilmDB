import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchList } from '../../context/WatchListContext';
import ContentCard from '../../components/ContentCard/ContentCard';
import './WatchListPage.css';

const WatchListPage = () => {
  const { watchList, toggleWatchList } = useWatchList();
  const [activeFilter, setActiveFilter] = useState('all');

  const moviesList = watchList.filter(item => item.media_type === 'movie');
  const tvShowsList = watchList.filter(item => item.media_type === 'tv');

  const getFilteredList = () => {
    if (activeFilter === 'movies') return moviesList;
    if (activeFilter === 'tv') return tvShowsList;
    return watchList;
  };

  const filteredList = getFilteredList();

  const handleRemove = (id, mediaType) => {
    const item = watchList.find(w => w.id === id && w.media_type === mediaType);
    if (item) {
      toggleWatchList(item);
    }
  };

  const filters = [
    { id: 'all', label: 'All', count: watchList.length },
    { id: 'movies', label: 'Movies', count: moviesList.length },
    { id: 'tv', label: 'TV Shows', count: tvShowsList.length }
  ];

  return (
    <motion.div
      className="watch-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="watch-list-header">
        <h1>My Watch List</h1>
        <p>Content you want to watch later</p>
      </div>

      <div className="watch-list-container">
        {watchList.length === 0 ? (
          <motion.div
            className="watch-list-empty"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <p>Your watch list is empty. Start adding movies and TV shows!</p>
          </motion.div>
        ) : (
          <>
            <div className="watch-list-filters">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                  <span className="filter-count">{filter.count}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                className="watch-list-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {filteredList.length === 0 ? (
                  <div className="filter-empty">
                    <p>No {activeFilter === 'movies' ? 'movies' : activeFilter === 'tv' ? 'TV shows' : 'content'} in watch list.</p>
                  </div>
                ) : (
                  filteredList.map((item, index) => (
                    <div
                      key={`${item.id}-${item.media_type}`}
                      className="watch-list-item"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleRemove(item.id, item.media_type);
                      }}
                    >
                      <ContentCard content={item} index={index} />
                      <motion.button
                        className="remove-from-watchlist"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item.id, item.media_type)}
                        title="Remove from watch list"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                      </motion.button>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WatchListPage;
