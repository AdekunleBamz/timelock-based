import type { ReactNode, CSSProperties } from 'react';
import './Grid.css';

interface GridProps {
  children: ReactNode;
  columns?: number | string;
  rows?: number | string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: CSSProperties;
}

export function Grid({
  children,
  columns = 1,
  rows,
  gap = 'md',
  className = '',
  style,
}: GridProps) {
  const gridStyle: CSSProperties = {
    ...style,
    gridTemplateColumns: typeof columns === 'number' 
      ? `repeat(${columns}, 1fr)` 
      : columns,
    ...(rows && {
      gridTemplateRows: typeof rows === 'number' 
        ? `repeat(${rows}, 1fr)` 
        : rows,
    }),
  };

  return (
    <div 
      className={`grid grid-gap--${gap} ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
}

interface GridItemProps {
  children: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  rowStart?: number;
  className?: string;
  style?: CSSProperties;
}

export function GridItem({
  children,
  colSpan,
  rowSpan,
  colStart,
  rowStart,
  className = '',
  style,
}: GridItemProps) {
  const itemStyle: CSSProperties = {
    ...style,
    ...(colSpan && { gridColumn: `span ${colSpan}` }),
    ...(rowSpan && { gridRow: `span ${rowSpan}` }),
    ...(colStart && { gridColumnStart: colStart }),
    ...(rowStart && { gridRowStart: rowStart }),
  };

  return (
    <div className={`grid-item ${className}`} style={itemStyle}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps extends Omit<GridProps, 'columns'> {
  minItemWidth?: string;
}

export function ResponsiveGrid({
  children,
  minItemWidth = '280px',
  gap = 'md',
  className = '',
  style,
}: ResponsiveGridProps) {
  const gridStyle: CSSProperties = {
    ...style,
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
  };

  return (
    <div 
      className={`grid grid-gap--${gap} ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
}
