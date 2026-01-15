/**
 * Form group component for organizing form elements
 */

import './FormGroup.css';

interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function FormGroup({ children, title, description, className = '' }: FormGroupProps) {
  return (
    <div className={`form-group ${className}`}>
      {(title || description) && (
        <div className="form-group__header">
          {title && <h3 className="form-group__title">{title}</h3>}
          {description && <p className="form-group__description">{description}</p>}
        </div>
      )}
      <div className="form-group__content">{children}</div>
    </div>
  );
}
