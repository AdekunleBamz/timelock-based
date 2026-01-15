
import type { ReactNode } from 'react';
import './MobileNav.css';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface MobileNavProps {
  items: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function MobileNav({ items, activeId, onNavigate }: MobileNavProps) {
  return (
    <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeId === item.id ? 'mobile-nav-item--active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
          aria-current={activeId === item.id ? 'page' : undefined}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="mobile-nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
          )}
        </button>
      ))}
    </nav>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  return (
    <>
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={onClose} aria-hidden="true" />
      )}
      <div className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-menu-header">
          <button
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="mobile-menu-content">{children}</div>
      </div>
    </>
  );
}

export function MobileMenuToggle({ onClick }: { onClick: () => void }) {
  return (
    <button className="mobile-menu-toggle" onClick={onClick} aria-label="Open menu">
      <span className="mobile-menu-toggle-bar"></span>
      <span className="mobile-menu-toggle-bar"></span>
      <span className="mobile-menu-toggle-bar"></span>
    </button>
  );
}
