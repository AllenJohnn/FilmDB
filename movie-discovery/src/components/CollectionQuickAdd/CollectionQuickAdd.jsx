import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollections } from '../../context/CollectionsContext';
import './CollectionQuickAdd.css';

const CollectionQuickAdd = ({ item, onClose }) => {
  const { collections, addToCollection, isInCollection } = useCollections();
  const [collectionsWithItems, setCollectionsWithItems] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    setCollectionsWithItems(collections.map(c => ({
      ...c,
      isSelected: isInCollection(item.id, c.id)
    })));
  }, [collections, item.id, isInCollection]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleToggle = (collectionId) => {
    addToCollection(item.id, collectionId);
    setCollectionsWithItems(prev =>
      prev.map(c => c.id === collectionId ? { ...c, isSelected: !c.isSelected } : c)
    );
  };

  return (
    <motion.div
      ref={menuRef}
      className="collection-quick-add"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div className="quick-add-title">Add to Collection</div>
      <div className="quick-add-list">
        {collectionsWithItems.map(collection => (
          <button
            key={collection.id}
            className={`quick-add-item ${collection.isSelected ? 'selected' : ''}`}
            onClick={() => handleToggle(collection.id)}
          >
            <div className="quick-add-color" style={{ backgroundColor: collection.color }} />
            <span>{collection.name}</span>
            {collection.isSelected && <span className="checkmark">✓</span>}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default CollectionQuickAdd;
