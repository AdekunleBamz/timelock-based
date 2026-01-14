import type { ReactNode, CSSProperties } from 'react';
import './Section.css';

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'card' | 'outlined';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Section({
  children,
  title,
  description,
  action,
  variant = 'default',
  spacing = 'md',
  className = '',
  style,
  id,
}: SectionProps) {
  const hasHeader = title || description || action;

  return (
    <section 
      className={`section section--${variant} section-spacing--${spacing} ${className}`}
      style={style}
      id={id}
    >
      {hasHeader && (
        <div className="section-header">
          <div className="section-header-text">
            {title && <h2 className="section-title">{title}</h2>}
            {description && <p className="section-description">{description}</p>}
          </div>
          {action && <div className="section-action">{action}</div>}
        </div>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}
