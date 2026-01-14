import type { ReactNode } from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export function SkeletonLoader({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className = '',
}: SkeletonLoaderProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };
  
  return (
    <span 
      className={`skeleton-loader skeleton-loader--${variant} skeleton-loader--${animation} ${className}`}
      style={style}
    />
  );
}

interface SkeletonTextLoaderProps {
  lines?: number;
  widths?: (string | number)[];
}

export function SkeletonTextLoader({ lines = 3, widths }: SkeletonTextLoaderProps) {
  return (
    <div className="skeleton-text-loader">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader 
          key={i} 
          variant="text" 
          width={widths?.[i] ?? (i === lines - 1 ? '60%' : '100%')} 
        />
      ))}
    </div>
  );
}

interface SkeletonCardLoaderProps {
  hasImage?: boolean;
  imageHeight?: number;
  lines?: number;
}

export function SkeletonCardLoader({ 
  hasImage = true, 
  imageHeight = 120,
  lines = 3 
}: SkeletonCardLoaderProps) {
  return (
    <div className="skeleton-card-loader">
      {hasImage && (
        <SkeletonLoader variant="rectangular" height={imageHeight} />
      )}
      <div className="skeleton-card-loader-content">
        <SkeletonLoader variant="text" width="80%" height={24} />
        <SkeletonTextLoader lines={lines} />
      </div>
    </div>
  );
}

interface SkeletonContainerLoaderProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function SkeletonContainerLoader({ 
  isLoading, 
  children, 
  fallback 
}: SkeletonContainerLoaderProps) {
  if (isLoading) {
    return <>{fallback ?? <SkeletonCardLoader />}</>;
  }
  
  return <>{children}</>;
}
