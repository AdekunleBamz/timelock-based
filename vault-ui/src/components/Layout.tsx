import type { HTMLAttributes, ReactNode } from 'react';
import './Layout.css';

type Spacing = '0' | '1' | '2' | '3' | '4' | '6' | '8';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: Spacing;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

export function Stack({
  children,
  gap = '4',
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  ...props
}: StackProps) {
  const classes = [
    'stack',
    `stack-${direction}`,
    `gap-${gap}`,
    `items-${align}`,
    `justify-${justify}`,
    wrap ? 'flex-wrap' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: Spacing;
}

export function Grid({
  children,
  cols = 2,
  gap = '4',
  className = '',
  ...props
}: GridProps) {
  return (
    <div className={`grid grid-cols-${cols} gap-${gap} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Inline component for side-by-side content
interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: Spacing;
  align?: 'start' | 'center' | 'end';
}

export function Inline({
  children,
  gap = '2',
  align = 'center',
  className = '',
  ...props
}: InlineProps) {
  return (
    <div className={`inline-layout gap-${gap} items-${align} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Spacer component for pushing content apart
export function Spacer() {
  return <div className="spacer" />;
}
