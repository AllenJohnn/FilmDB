import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollections } from '../../context/CollectionsContext';
import ContentCard from '../../components/ContentCard/ContentCard';
import './CollectionsPage.css';

const CollectionsPage = () => {
  const { collections, removeFromCollection } = useCollections();
  const [expandedCollection, setExpandedCollection] = useState(collections[0]?.id || null);

  const handleRemoveFromCollection = (collectionId, contentId, mediaType) => {
    removeFromCollection(collectionId, contentId, mediaType);
  };

  return (
    <motion.div
      className="collections-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="collections-header">
        <h1>My Collections</h1>
        <p>Organize and manage your favorite content</p>
      </div>

      <div className="collections-container">
        {collections.length === 0 ? (
          <div className="collections-empty">
            <p>No collections yet. Start by adding items to your collections!</p>
          </div>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="collection-section">
              <button
                className={`collection-header-btn ${expandedCollection === collection.id ? 'active' : ''}`}
                onClick={() => setExpandedCollection(
                  expandedCollection === collection.id ? null : collection.id
                )}
              >
                <div className="collection-header-info">
                  <div
                    className="collection-color-dot"
                    style={{ backgroundColor: collection.color || '#44e4b1' }}
                  />
                  <div>
                    <h2>{collection.name}</h2>
                    <span className="collection-count">
                      {collection.items.length} item{collection.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <svg
                  className="collection-toggle-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <AnimatePresence>
                {expandedCollection === collection.id && (
                  <motion.div
                    className="collection-items"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {collection.items.length === 0 ? (
                      <p className="empty-collection-msg">No items in this collection yet</p>
                    ) : (
                      <div className="collection-grid">
                        {collection.items.map((item) => (
                          <div key={`${item.id}-${item.media_type}`} className="collection-item">
                            <ContentCard content={item} />
                            <button
                              className="remove-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromCollection(collection.id, item.id, item.media_type);
                              }}
                              title="Remove from collection"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CollectionsPage;
