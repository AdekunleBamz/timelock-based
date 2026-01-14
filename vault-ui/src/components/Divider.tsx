import './Divider.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className = '',
}: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div className={`divider divider-with-label ${className}`}>
        <span className="divider-line"></span>
        <span className="divider-label">{label}</span>
        <span className="divider-line"></span>
      </div>
    );
  }

  return (
    <hr
      className={`divider divider-${orientation} ${className}`}
      aria-orientation={orientation}
    />
  );
}
