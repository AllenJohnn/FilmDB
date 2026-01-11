import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const RecentlyWatchedContext = createContext();

export const useRecentlyWatched = () => {
  const context = useContext(RecentlyWatchedContext);
  if (!context) {
    throw new Error('useRecentlyWatched must be used within RecentlyWatchedProvider');
  }
  return context;
};

export const RecentlyWatchedProvider = ({ children }) => {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWatched = async () => {
      try {
        const stored = await localforage.getItem('recently-watched') || [];
        setWatched(stored);
      } catch (error) {
        console.error('Failed to load recently watched:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWatched();
  }, []);

  const addWatched = async (item) => {
    const newWatched = [
      { ...item, watchedAt: new Date().toISOString() },
      ...watched.filter(w => w.id !== item.id)
    ].slice(0, 50); // Keep last 50

    setWatched(newWatched);
    await localforage.setItem('recently-watched', newWatched);
  };

  const isWatched = (itemId) => watched.some(w => w.id === itemId);

  const getWatched = () => watched;

  const clearWatched = async () => {
    setWatched([]);
    await localforage.setItem('recently-watched', []);
  };

  return (
    <RecentlyWatchedContext.Provider
      value={{ watched, addWatched, isWatched, getWatched, clearWatched, loading }}
    >
      {children}
    </RecentlyWatchedContext.Provider>
  );
};
