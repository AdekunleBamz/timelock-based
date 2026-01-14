import { formatAddress } from '../utils';
import { CopyButton } from './CopyButton';
import { Avatar } from './Avatar';
import './AddressDisplay.css';

interface AddressDisplayProps {
  address: string;
  showAvatar?: boolean;
  showCopy?: boolean;
  showFullOnHover?: boolean;
  linkToExplorer?: boolean;
  explorerUrl?: string;
  className?: string;
}

export function AddressDisplay({
  address,
  showAvatar = false,
  showCopy = true,
  showFullOnHover = true,
  linkToExplorer = false,
  explorerUrl = 'https://basescan.org',
  className = '',
}: AddressDisplayProps) {
  const formattedAddress = formatAddress(address);
  const fullUrl = `${explorerUrl}/address/${address}`;

  const content = (
    <span 
      className={`address-text ${showFullOnHover ? 'hoverable' : ''}`}
      data-full-address={showFullOnHover ? address : undefined}
    >
      {formattedAddress}
    </span>
  );

  return (
    <div className={`address-display ${className}`}>
      {showAvatar && <Avatar address={address} size="small" />}
      
      {linkToExplorer ? (
        <a 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="address-link"
        >
          {content}
        </a>
      ) : (
        content
      )}
      
      {showCopy && <CopyButton text={address} />}
    </div>
  );
}
