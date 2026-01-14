import './Avatar.css';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  address?: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  style?: React.CSSProperties;
}

// Generate a deterministic color from an address
function generateColorFromAddress(address: string): string {
  const hash = address.slice(2, 10);
  const hue = parseInt(hash, 16) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

// Get initials from address
function getInitials(address: string): string {
  return address.slice(2, 4).toUpperCase();
}

export function Avatar({
  address,
  src,
  alt,
  size = 'medium',
  className = '',
  style,
}: AvatarProps) {
  const backgroundColor = address ? generateColorFromAddress(address) : 'var(--bg-tertiary)';
  const initials = address ? getInitials(address) : '?';

  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ backgroundColor: src ? undefined : backgroundColor, ...style }}
      role="img"
      aria-label={alt || address || 'Avatar'}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="avatar-image" />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  addresses: string[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ addresses, max = 4, size = 'small' }: AvatarGroupProps) {
  const visible = addresses.slice(0, max);
  const remaining = addresses.length - max;

  return (
    <div className="avatar-group">
      {visible.map((address, index) => (
        <Avatar
          key={address}
          address={address}
          size={size}
          className="avatar-group-item"
          style={{ zIndex: visible.length - index } as React.CSSProperties}
        />
      ))}
      {remaining > 0 && (
        <div className={`avatar avatar-${size} avatar-remaining`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
