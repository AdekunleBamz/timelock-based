import './PriceTickerTape.css';
import { useEffect, useState } from 'react';

interface PriceTicker {
  symbol: string;
  price: number;
  change24h: number;
}

export function PriceTickerTape() {
  const [tickers] = useState<PriceTicker[]>([
    { symbol: 'ETH', price: 2234.56, change24h: 2.34 },
    { symbol: 'BTC', price: 43567.89, change24h: -1.23 },
    { symbol: 'USDC', price: 1.0, change24h: 0.01 },
    { symbol: 'BASE', price: 0.12, change24h: 5.67 },
  ]);

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div className="price-ticker-tape">
      <div className={`price-ticker-content ${animated ? 'animate' : ''}`}>
        {[...tickers, ...tickers].map((ticker, index) => (
          <div key={index} className="price-ticker-item">
            <span className="ticker-symbol">{ticker.symbol}</span>
            <span className="ticker-price">${ticker.price.toLocaleString()}</span>
            <span className={`ticker-change ${ticker.change24h >= 0 ? 'positive' : 'negative'}`}>
              {ticker.change24h >= 0 ? '+' : ''}{ticker.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
