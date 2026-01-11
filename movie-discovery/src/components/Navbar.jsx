import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar Component - Main navigation bar with search functionality
 * @param {Function} onSearch - Callback function when search is performed
 */
const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If search is cleared, trigger search with empty string
    if (value === '') {
      onSearch('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand" onClick={() => onSearch('')}>
          <span className="brand-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10.5L16 6l9 4.5v11L16 26l-9-4.5v-11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 26v-9.5l9-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="1.4" fill="currentColor" />
              <circle cx="20" cy="18" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-text">FilmDB</span>
        </Link>

        {/* Search Form */}
        <form className="navbar-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
