import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const SearchHistoryContext = createContext();

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error('useSearchHistory must be used within SearchHistoryProvider');
  }
  return context;
};

export const SearchHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await localforage.getItem('search-history') || [];
        setHistory(stored);
      } catch (error) {
        console.error('Failed to load search history:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const addSearch = async (query) => {
    if (!query.trim()) return;
    
    const newHistory = [
      { query: query.trim(), timestamp: new Date().toISOString() },
      ...history.filter(h => h.query !== query.trim())
    ].slice(0, 15); // Keep last 15 searches

    setHistory(newHistory);
    await localforage.setItem('search-history', newHistory);
  };

  const getHistory = () => history;

  const clearHistory = async () => {
    setHistory([]);
    await localforage.setItem('search-history', []);
  };

  return (
    <SearchHistoryContext.Provider
      value={{ history, addSearch, getHistory, clearHistory, loading }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
};
