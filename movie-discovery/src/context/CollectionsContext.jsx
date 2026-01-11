import { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const CollectionsContext = createContext();

localforage.config({
  name: 'FilmDB',
  storeName: 'collections'
});

const DEFAULT_COLLECTIONS = [
  { id: 'to-watch', name: 'To Watch', color: '#44e4b1', icon: '📋' },
  { id: 'favorites', name: 'Favorites', color: '#ff6b9d', icon: '⭐' },
  { id: 'classics', name: 'Classics', color: '#ffd700', icon: '🎬' }
];

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const storedItems = await localforage.getItem('items');
        if (storedItems) {
          setItems(storedItems);
        }
      } catch (error) {
        console.error('Failed to load collections:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  useEffect(() => {
    if (!loading) {
      localforage.setItem('items', items);
    }
  }, [items, loading]);

  const addToCollection = (collectionId, content) => {
    setItems(prev => ({
      ...prev,
      [collectionId]: [...(prev[collectionId] || []), { ...content, added_at: new Date().toISOString() }]
    }));
  };

  const removeFromCollection = (collectionId, contentId, mediaType) => {
    setItems(prev => ({
      ...prev,
      [collectionId]: (prev[collectionId] || []).filter(
        item => !(item.id === contentId && item.media_type === mediaType)
      )
    }));
  };

  const isInCollection = (collectionId, contentId, mediaType) => {
    return (items[collectionId] || []).some(
      item => item.id === contentId && item.media_type === mediaType
    );
  };

  const getCollectionItems = (collectionId) => {
    return items[collectionId] || [];
  };

  // Map collections with their items
  const collectionsWithItems = collections.map(collection => ({
    ...collection,
    items: items[collection.id] || []
  }));

  const value = {
    collections: collectionsWithItems,
    items,
    loading,
    addToCollection,
    removeFromCollection,
    isInCollection,
    getCollectionItems,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within CollectionsProvider');
  }
  return context;
};

export default CollectionsContext;
