import { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const LikesContext = createContext();

// Configure localforage
localforage.config({
  name: 'FilmDB',
  storeName: 'liked_content'
});

export const LikesProvider = ({ children }) => {
  const [likedContent, setLikedContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load liked content from storage on mount
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const stored = await localforage.getItem('likes');
        if (stored) {
          setLikedContent(stored);
        }
      } catch (error) {
        console.error('Failed to load likes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLikes();
  }, []);

  // Save to storage whenever likes change
  useEffect(() => {
    if (!loading) {
      localforage.setItem('likes', likedContent);
    }
  }, [likedContent, loading]);

  const isLiked = (id, type) => {
    return likedContent.some(item => item.id === id && item.media_type === type);
  };

  const toggleLike = (content) => {
    const { id, media_type } = content;
    
    if (isLiked(id, media_type)) {
      // Remove from likes
      setLikedContent(prev => prev.filter(item => !(item.id === id && item.media_type === media_type)));
    } else {
      // Add to likes with timestamp
      setLikedContent(prev => [...prev, { 
        ...content, 
        media_type,
        liked_at: new Date().toISOString() 
      }]);
    }
  };

  const getLikedByType = (type) => {
    return likedContent.filter(item => item.media_type === type);
  };

  // Get aggregated data from liked content for recommendations
  const getLikeStats = () => {
    const genres = {};
    const languages = {};
    const actors = {};

    likedContent.forEach(item => {
      // Count genres
      if (item.genre_ids) {
        item.genre_ids.forEach(genreId => {
          genres[genreId] = (genres[genreId] || 0) + 1;
        });
      }

      // Count languages
      if (item.original_language) {
        languages[item.original_language] = (languages[item.original_language] || 0) + 1;
      }

      // Store cast if available
      if (item.cast) {
        item.cast.slice(0, 5).forEach(actor => {
          actors[actor.id] = actor;
        });
      }
    });

    // Sort by frequency
    const topGenres = Object.entries(genres)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => parseInt(id));

    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    return {
      topGenres: topGenres.slice(0, 3),
      topLanguages: topLanguages.slice(0, 2),
      topActors: Object.values(actors).slice(0, 5)
    };
  };

  const clearAllLikes = () => {
    setLikedContent([]);
  };

  return (
    <LikesContext.Provider value={{
      likedContent,
      isLiked,
      toggleLike,
      getLikedByType,
      getLikeStats,
      clearAllLikes,
      loading
    }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within LikesProvider');
  }
  return context;
};