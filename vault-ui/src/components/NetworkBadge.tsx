import { Badge } from './Badge';
import './NetworkBadge.css';

interface NetworkBadgeProps {
  chainId: number | null;
  expectedChainId?: number;
  showName?: boolean;
}

const CHAIN_INFO: Record<number, { name: string; color: string }> = {
  1: { name: 'Ethereum', color: '#627eea' },
  8453: { name: 'Base', color: '#0052ff' },
  84532: { name: 'Base Sepolia', color: '#0052ff' },
  10: { name: 'Optimism', color: '#ff0420' },
  42161: { name: 'Arbitrum', color: '#28a0f0' },
};

export function NetworkBadge({ 
  chainId, 
  expectedChainId = 8453,
  showName = true 
}: NetworkBadgeProps) {
  if (!chainId) {
    return (
      <Badge variant="default" size="small" dot>
        Not Connected
      </Badge>
    );
  }

  const isCorrectNetwork = chainId === expectedChainId;
  const chainInfo = CHAIN_INFO[chainId];

  if (!isCorrectNetwork) {
    return (
      <Badge variant="error" size="small" dot>
        Wrong Network
      </Badge>
    );
  }

  return (
    <div 
      className="network-badge" 
      style={{ '--network-color': chainInfo?.color ?? '#888' } as React.CSSProperties}
    >
      <span className="network-dot"></span>
      {showName && <span className="network-name">{chainInfo?.name ?? `Chain ${chainId}`}</span>}
    </div>
  );
}
