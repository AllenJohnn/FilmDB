import { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const WatchListContext = createContext();

localforage.config({
  name: 'FilmDB',
  storeName: 'watchlist'
});

export const WatchListProvider = ({ children }) => {
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWatchList = async () => {
      try {
        const stored = await localforage.getItem('watchlist');
        if (stored) {
          setWatchList(stored);
        }
      } catch (error) {
        console.error('Failed to load watch list:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWatchList();
  }, []);

  useEffect(() => {
    if (!loading) {
      localforage.setItem('watchlist', watchList);
    }
  }, [watchList, loading]);

  const isInWatchList = (id, type) => {
    return watchList.some(item => item.id === id && item.media_type === type);
  };

  const toggleWatchList = (content) => {
    const { id, media_type } = content;
    
    if (isInWatchList(id, media_type)) {
      setWatchList(prev => prev.filter(item => !(item.id === id && item.media_type === media_type)));
    } else {
      setWatchList(prev => [...prev, { 
        ...content, 
        media_type,
        added_at: new Date().toISOString() 
      }]);
    }
  };

  const getWatchListByType = (type) => {
    return watchList.filter(item => item.media_type === type);
  };

  const removeFromWatchList = (id, type) => {
    setWatchList(prev => prev.filter(item => !(item.id === id && item.media_type === type)));
  };

  const value = {
    watchList,
    loading,
    isInWatchList,
    toggleWatchList,
    getWatchListByType,
    removeFromWatchList,
  };

  return (
    <WatchListContext.Provider value={value}>
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchList = () => {
  const context = useContext(WatchListContext);
  if (!context) {
    throw new Error('useWatchList must be used within WatchListProvider');
  }
  return context;
};

export default WatchListContext;
