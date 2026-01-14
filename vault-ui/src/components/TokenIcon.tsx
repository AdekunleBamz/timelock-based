import './TokenIcon.css';

interface TokenIconProps {
  symbol: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  className?: string;
}

const tokenColors: Record<string, string> = {
  USDC: '#2775CA',
  USDT: '#26A17B',
  ETH: '#627EEA',
  WETH: '#627EEA',
  DAI: '#F5AC37',
  WBTC: '#F09242',
  BTC: '#F7931A',
};

export function TokenIcon({
  symbol,
  size = 'md',
  src,
  className = '',
}: TokenIconProps) {
  const upperSymbol = symbol.toUpperCase();
  const backgroundColor = tokenColors[upperSymbol] ?? '#6366f1';
  
  if (src) {
    return (
      <img 
        src={src}
        alt={symbol}
        className={`token-icon token-icon--${size} ${className}`}
      />
    );
  }
  
  return (
    <div 
      className={`token-icon token-icon--${size} token-icon--fallback ${className}`}
      style={{ backgroundColor }}
      title={symbol}
    >
      <span className="token-icon-letter">
        {upperSymbol.charAt(0)}
      </span>
    </div>
  );
}

interface TokenPairProps {
  primary: { symbol: string; src?: string };
  secondary: { symbol: string; src?: string };
  size?: 'sm' | 'md' | 'lg';
}

export function TokenPair({
  primary,
  secondary,
  size = 'md',
}: TokenPairProps) {
  return (
    <div className={`token-pair token-pair--${size}`}>
      <TokenIcon {...primary} size={size} className="token-pair-primary" />
      <TokenIcon {...secondary} size={size} className="token-pair-secondary" />
    </div>
  );
}
