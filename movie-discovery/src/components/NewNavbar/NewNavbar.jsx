import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLikes } from '../../context/LikesContext';
import { useWatchList } from '../../context/WatchListContext';
import { useTheme } from '../../context/ThemeContext';
import { useSearchHistory } from '../../context/SearchHistoryContext';
import { multiSearch, searchMovies, searchTVShows, getImageUrl } from '../../services/tmdbService';
import './NewNavbar.css';

const NewNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const { likedContent } = useLikes();
  const { watchList } = useWatchList();
  const { theme, toggleTheme } = useTheme();
  const { history: searchHistory, addSearch } = useSearchHistory();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.new-navbar-search input')?.focus();
      }
      // Ctrl+Shift+T for theme toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();
      if (q.length < 2) {
        setSuggestions([]);
        setSuggestLoading(false);
        return;
      }
      try {
        setSuggestLoading(true);
        // Try multiSearch first
        let results = [];
        try {
          const data = await multiSearch(q, 1);
          results = (data.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv');
        } catch (_) {
          results = [];
        }

        // Fallback: combine movie + tv search
        if (!results || results.length === 0) {
          const [m, t] = await Promise.all([searchMovies(q, 1), searchTVShows(q, 1)]);
          results = [
            ...(m.results || []).map(x => ({ ...x, media_type: 'movie' })),
            ...(t.results || []).map(x => ({ ...x, media_type: 'tv' }))
          ];
        }

        const suggestionsData = results
          .slice(0, 8)
          .map(item => ({
            id: item.id,
            title: item.title || item.name,
            media_type: item.media_type,
            year: (item.release_date || item.first_air_date || '').slice(0, 4),
            thumb: item.poster_path || item.backdrop_path || ''
          }));
        setSuggestions(suggestionsData);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Suggest failed', err);
          setSuggestions([]);
        }
      } finally {
        setSuggestLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (item) => {
    addSearch(searchQuery.trim());
    navigate(`/${item.media_type}/${item.id}`);
    setSearchQuery('');
    setSuggestions([]);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/liked', label: 'Liked', badge: likedContent.length },
    { path: '/watch-list', label: 'Watch List', badge: watchList.length },
    { path: '/collections', label: 'Collections' },
    { path: '/recommendations', label: 'For You' },
    { path: '/analytics', label: 'Stats' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className={`new-navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="new-navbar-container">
        <Link to="/" className="new-navbar-logo">
          <motion.span
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            FilmDB
          </motion.span>
        </Link>

        <div className="new-navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setHighlight(-1); }}
              onFocus={() => {
                if (suggestions.length === 0 && searchQuery.trim().length >= 2) {
                  setSuggestions([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlight(h => Math.min((h < 0 ? 0 : h + 1), suggestions.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlight(h => Math.max(h - 1, 0));
                } else if (e.key === 'Enter' && highlight >= 0 && suggestions[highlight]) {
                  e.preventDefault();
                  handleSuggestionSelect(suggestions[highlight]);
                } else if (e.key === 'Escape') {
                  setSuggestions([]);
                  setHighlight(-1);
                }
              }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </motion.button>
            {searchQuery.trim().length >= 2 && (suggestions.length > 0 || suggestLoading) && (
              <div className="new-navbar-suggestions">
                {suggestLoading && <div className="suggest-row muted">Searching…</div>}
                {!suggestLoading && suggestions.length === 0 && <div className="suggest-row muted">No results found</div>}
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    type="button"
                    className={`suggest-row ${highlight === idx ? 'active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => handleSuggestionSelect(item)}
                  >
                    {item.thumb ? (
                      <img className="suggest-thumb" src={getImageUrl(item.thumb, 'w92')} alt="" />
                    ) : (
                      <div className="suggest-thumb" aria-hidden="true" />
                    )}
                    <div className="suggest-text">
                      <div className="suggest-title">{item.title}</div>
                      <div className="suggest-meta">{item.media_type === 'tv' ? 'Series' : 'Film'} {item.year && `· ${item.year}`}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="new-navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`new-navbar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="link-badge">{link.badge}</span>
                )}
              </motion.span>
            </Link>
          ))}
          
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24M1 12h6m6 0h6m-1.78 7.78l-4.24-4.24m-6.08 0l-4.24 4.24" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button>
        </div>

        <button
          className="new-navbar-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"/>
            ) : (
              <>
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </>
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="new-navbar-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="new-navbar-mobile-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`new-navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="link-badge">{link.badge}</span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NewNavbar;