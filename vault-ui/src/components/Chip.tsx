import './Chip.css';

interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  onRemove?: () => void;
  icon?: string;
}

export function Chip({
  label,
  variant = 'default',
  size = 'medium',
  onRemove,
  icon,
}: ChipProps) {
  return (
    <div className={`chip chip--${variant} chip--${size}`}>
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
      {onRemove && (
        <button
          className="chip-remove"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
