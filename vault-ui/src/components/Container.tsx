import type { HTMLAttributes, ReactNode } from 'react';
import './Container.css';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large' | 'full';
  children: ReactNode;
}

export function Container({
  size = 'large',
  children,
  className = '',
  ...props
}: ContainerProps) {
  return (
    <div className={`container container-${size} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Section wrapper with padding and optional title
interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function Section({
  title,
  subtitle,
  children,
  className = '',
  ...props
}: SectionProps) {
  return (
    <section className={`section ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}
