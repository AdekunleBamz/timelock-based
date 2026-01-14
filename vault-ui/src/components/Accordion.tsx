import type { ReactNode } from 'react';
import './Accordion.css';
import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  onChange?: (expandedIds: string[]) => void;
}

export function Accordion({
  items,
  defaultExpanded = [],
  allowMultiple = false,
  onChange,
}: AccordionProps) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const toggleItem = (id: string) => {
    let newExpanded: string[];

    if (expanded.includes(id)) {
      newExpanded = expanded.filter((i) => i !== id);
    } else if (allowMultiple) {
      newExpanded = [...expanded, id];
    } else {
      newExpanded = [id];
    }

    setExpanded(newExpanded);
    onChange?.(newExpanded);
  };

  return (
    <div className="accordion">
      {items.map((item) => {
        const isExpanded = expanded.includes(item.id);

        return (
          <div
            key={item.id}
            className={`accordion-item ${isExpanded ? 'accordion-item--expanded' : ''} ${item.disabled ? 'accordion-item--disabled' : ''}`}
          >
            <button
              className="accordion-trigger"
              onClick={() => !item.disabled && toggleItem(item.id)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              disabled={item.disabled}
            >
              <span className="accordion-title">{item.title}</span>
              <span className="accordion-icon">
                {isExpanded ? '−' : '+'}
              </span>
            </button>
            {isExpanded && (
              <div
                id={`accordion-content-${item.id}`}
                className="accordion-content"
                role="region"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
