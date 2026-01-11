import "./Skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: "text" | "circle" | "rect";
  className?: string;
}

export function Skeleton({ 
  width = "100%", 
  height = "20px", 
  variant = "rect",
  className = ""
}: SkeletonProps) {
  return (
    <div 
      className={`skeleton ${variant} ${className}`}
      style={{ width, height }}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="skeleton-card">
      <Skeleton height="24px" width="60%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="16px" width={`${80 - i * 10}%`} />
      ))}
    </div>
  );
}

export function SkeletonDepositCard() {
  return (
    <div className="skeleton-deposit-card">
      <div className="skeleton-header">
        <Skeleton height="20px" width="60px" />
        <Skeleton height="24px" width="80px" />
      </div>
      <Skeleton height="32px" width="120px" />
      <div className="skeleton-details">
        <Skeleton height="14px" width="100%" />
        <Skeleton height="14px" width="80%" />
      </div>
      <Skeleton height="40px" width="100%" />
    </div>
  );
}
