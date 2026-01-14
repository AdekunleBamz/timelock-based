import './GasEstimator.css';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/format';

interface GasEstimatorProps {
  operation: 'deposit' | 'withdraw' | 'claim';
  onEstimate?: (gasPrice: string) => void;
}

export function GasEstimator({ operation, onEstimate }: GasEstimatorProps) {
  const [gasPrice, setGasPrice] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate gas estimation
    const estimateGas = async () => {
      setIsLoading(true);
      
      // Simulated estimates
      const estimates = {
        deposit: '0.0012',
        withdraw: '0.0015',
        claim: '0.0008',
      };

      setTimeout(() => {
        const estimate = estimates[operation];
        setGasPrice(estimate);
        onEstimate?.(estimate);
        setIsLoading(false);
      }, 500);
    };

    estimateGas();
  }, [operation, onEstimate]);

  if (isLoading) {
    return (
      <div className="gas-estimator">
        <div className="gas-estimator-label">Estimating gas...</div>
      </div>
    );
  }

  return (
    <div className="gas-estimator">
      <div className="gas-estimator-icon">⛽</div>
      <div className="gas-estimator-content">
        <div className="gas-estimator-label">Estimated Gas Fee</div>
        <div className="gas-estimator-value">~{formatCurrency(gasPrice)} ETH</div>
      </div>
    </div>
  );
}
