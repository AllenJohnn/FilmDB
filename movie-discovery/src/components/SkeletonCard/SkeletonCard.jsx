import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-text" />
      <div className="skeleton-text skeleton-text-short" />
    </div>
  );
};

export default SkeletonCard;
