import { motion, AnimatePresence } from 'framer-motion';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, trailer, onClose, title }) => {
  if (!trailer || !trailer.key) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="trailer-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="trailer-modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="trailer-modal-close"
              onClick={onClose}
              aria-label="Close trailer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="trailer-modal-header">
              <h2>{title}</h2>
            </div>

            <div className="trailer-modal-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrailerModal;
