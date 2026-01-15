import { Modal } from './Modal';
import { Button } from './Button';
import './WalletConnectModal.css';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => void;
  isConnecting?: boolean;
}

export function WalletConnectModal({
  isOpen,
  onClose,
  onConnect,
  isConnecting = false,
}: WalletConnectModalProps) {
  const wallets: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect with MetaMask wallet',
      installed: typeof window !== 'undefined' && !!(window as any).ethereum,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect with Coinbase Wallet',
      installed: false,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🌐',
      description: 'Scan with mobile wallet',
      installed: true,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Wallet" size="medium">
      <div className="wallet-connect-modal">
        <p className="wallet-connect-description">
          Choose a wallet provider to connect to the TimeVault protocol
        </p>

        <div className="wallet-options">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className="wallet-option"
              onClick={() => onConnect(wallet.id)}
              disabled={isConnecting || !wallet.installed}
            >
              <span className="wallet-option-icon">{wallet.icon}</span>
              <div className="wallet-option-info">
                <span className="wallet-option-name">{wallet.name}</span>
                <span className="wallet-option-description">{wallet.description}</span>
              </div>
              {!wallet.installed && (
                <span className="wallet-option-badge">Not Installed</span>
              )}
              {isConnecting && <span className="wallet-option-loading">⏳</span>}
            </button>
          ))}
        </div>

        <div className="wallet-connect-disclaimer">
          <p className="disclaimer-text">
            ⚠️ By connecting, you agree to our Terms of Service and Privacy Policy.
            Only connect wallets you trust.
          </p>
        </div>
      </div>
    </Modal>
  );
}

interface NetworkSwitcherProps {
  currentNetwork?: {
    id: number;
    name: string;
    icon: string;
  };
  onSwitch: () => void;
  isCorrectNetwork: boolean;
}

export function NetworkSwitcher({
  currentNetwork,
  onSwitch,
  isCorrectNetwork,
}: NetworkSwitcherProps) {
  if (isCorrectNetwork) return null;

  return (
    <div className="network-switcher">
      <div className="network-switcher-content">
        <span className="network-switcher-icon">⚠️</span>
        <div className="network-switcher-text">
          <span className="network-switcher-title">Wrong Network</span>
          <span className="network-switcher-description">
            {currentNetwork ? `Connected to ${currentNetwork.name}` : 'Please switch to Base'}
          </span>
        </div>
      </div>
      <Button variant="danger" size="small" onClick={onSwitch}>
        Switch to Base
      </Button>
    </div>
  );
}
