import './Breadcrumb.css';
import type { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export function Breadcrumb({
  items,
  separator = '/',
}: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className="breadcrumb-link">
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <button
                  className="breadcrumb-link breadcrumb-button"
                  onClick={item.onClick}
                >
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  {item.label}
                </button>
              )}
              {!isLast && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
