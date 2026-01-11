import { motion } from 'framer-motion';
import { useLikes } from '../../context/LikesContext';
import './LikeButton.css';

const LikeButton = ({ content, size = 'medium', className = '' }) => {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(content.id, content.media_type);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleLike(content);
  };

  return (
    <motion.button
      className={`like-button ${size} ${liked ? 'liked' : ''} ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        initial={false}
        animate={{
          scale: liked ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
      {liked && (
        <motion.span
          className="like-particles"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default LikeButton;