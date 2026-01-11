import { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className = '', onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            setIsLoaded(true);
            onLoad?.();
          };
          img.onerror = () => setHasError(true);
          observer.unobserve(img);
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [onLoad]);

  return (
    <img
      ref={imgRef}
      data-src={src}
      alt={alt}
      className={`lazy-image ${className} ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
    />
  );
};

export default LazyImage;
