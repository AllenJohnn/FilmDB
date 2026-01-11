import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const UserRatingsContext = createContext();

export const useUserRatings = () => {
  const context = useContext(UserRatingsContext);
  if (!context) {
    throw new Error('useUserRatings must be used within UserRatingsProvider');
  }
  return context;
};

export const UserRatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const stored = await localforage.getItem('user-ratings') || {};
        setRatings(stored);
      } catch (error) {
        console.error('Failed to load user ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRatings();
  }, []);

  const setRating = async (itemId, rating) => {
    const newRatings = { ...ratings };
    if (rating === null) {
      delete newRatings[itemId];
    } else {
      newRatings[itemId] = Math.max(1, Math.min(10, rating));
    }
    setRatings(newRatings);
    await localforage.setItem('user-ratings', newRatings);
  };

  const getRating = (itemId) => ratings[itemId] || null;

  const getAverageRating = () => {
    const values = Object.values(ratings);
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  };

  return (
    <UserRatingsContext.Provider
      value={{ ratings, setRating, getRating, getAverageRating, loading }}
    >
      {children}
    </UserRatingsContext.Provider>
  );
};
