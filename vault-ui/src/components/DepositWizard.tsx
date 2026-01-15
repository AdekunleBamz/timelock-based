import './DepositWizard.css';
import { useState } from 'react';
import { Button } from './Button';
import { AmountInput } from './AmountInput';
import { LockDurationSelector } from './LockDurationSelector';
import { DepositSummary } from './DepositSummary';

interface DepositWizardProps {
  onComplete: (amount: string, duration: number, optionId: number) => void;
  onCancel: () => void;
}

const STEPS = ['Amount', 'Duration', 'Review'];

export function DepositWizard({ onComplete, onCancel }: DepositWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(0);
  const [optionId] = useState(1);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(amount, duration, optionId);
  };

  const canProceed = () => {
    if (currentStep === 0) return parseFloat(amount) > 0;
    if (currentStep === 1) return duration > 0;
    return true;
  };

  return (
    <div className="deposit-wizard">
      <div className="deposit-wizard-header">
        <div className="deposit-wizard-steps">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`deposit-wizard-step ${
                index === currentStep ? 'active' : ''
              } ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="deposit-wizard-step-number">{index + 1}</div>
              <div className="deposit-wizard-step-label">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="deposit-wizard-content">
        {currentStep === 0 && (
          <div className="deposit-wizard-step-content">
            <h3>Enter Deposit Amount</h3>
            <AmountInput
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              label="Amount to deposit"
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="deposit-wizard-step-content">
            <h3>Select Lock Duration</h3>
            <LockDurationSelector
              value={duration}
              onChange={(d: number) => {
                setDuration(d);
              }}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="deposit-wizard-step-content">
            <h3>Review Your Deposit</h3>
            <DepositSummary amount={parseFloat(amount)} duration={duration} />
          </div>
        )}
      </div>

      <div className="deposit-wizard-actions">
        <Button variant="secondary" onClick={currentStep === 0 ? onCancel : handleBack}>
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={currentStep === STEPS.length - 1 ? handleComplete : handleNext}
          disabled={!canProceed()}
        >
          {currentStep === STEPS.length - 1 ? 'Confirm Deposit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
