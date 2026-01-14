import './ResponsiveImage.css';
import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill';
  loading?: 'lazy' | 'eager';
  placeholder?: string;
}

export function ResponsiveImage({
  src,
  alt,
  aspectRatio = 'auto',
  objectFit = 'cover',
  loading = 'lazy',
  placeholder,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const ratioMap = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    'auto': 'auto',
  };

  return (
    <div
      className={`responsive-image ${aspectRatio !== 'auto' ? 'has-ratio' : ''}`}
      style={aspectRatio !== 'auto' ? { paddingTop: ratioMap[aspectRatio] } : undefined}
    >
      {!isLoaded && !hasError && placeholder && (
        <div className="image-placeholder">{placeholder}</div>
      )}
      {hasError ? (
        <div className="image-error">Failed to load image</div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`image ${isLoaded ? 'loaded' : ''}`}
          style={{ objectFit }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
