import type { ReactNode } from 'react';
import './Dropdown.css';
import { useState, useRef } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: number | 'auto' | 'trigger';
}

export function Dropdown({
  trigger,
  items,
  align = 'left',
  width = 'auto',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
  };

  const menuStyle = {
    width: width === 'trigger' && triggerRef.current 
      ? triggerRef.current.offsetWidth 
      : width === 'auto' 
        ? undefined 
        : width,
  };

  return (
    <div ref={containerRef} className="dropdown">
      <div 
        ref={triggerRef}
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>
      {isOpen && (
        <div 
          className={`dropdown-menu dropdown-menu--${align}`}
          style={menuStyle}
        >
          {items.map((item) => (
            <button
              key={item.id}
              className={`dropdown-item ${item.disabled ? 'dropdown-item--disabled' : ''} ${item.danger ? 'dropdown-item--danger' : ''}`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
              <span className="dropdown-item-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
