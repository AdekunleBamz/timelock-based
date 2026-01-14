import { Button } from './Button';
import { Avatar } from './Avatar';
import { formatAddress } from '../utils';
import './WalletButton.css';

interface WalletButtonProps {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({
  address,
  isConnecting,
  isConnected,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  if (isConnecting) {
    return (
      <Button variant="primary" isLoading>
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="wallet-button-connected">
        <Avatar address={address} size="small" />
        <span className="wallet-address">{formatAddress(address)}</span>
        <button 
          className="wallet-disconnect" 
          onClick={onDisconnect}
          aria-label="Disconnect wallet"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <Button 
      variant="primary" 
      onClick={onConnect}
      leftIcon={<span>🦊</span>}
    >
      Connect Wallet
    </Button>
  );
}
