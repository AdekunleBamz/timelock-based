import './StepIndicator.css';
import type { ReactNode } from 'react';

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (index: number) => void;
  allowClickPrevious?: boolean;
}

export function StepIndicator({
  steps,
  currentStep,
  orientation = 'horizontal',
  onStepClick,
  allowClickPrevious = true,
}: StepIndicatorProps) {
  const handleStepClick = (index: number) => {
    if (!onStepClick) return;
    if (allowClickPrevious && index < currentStep) {
      onStepClick(index);
    }
  };

  return (
    <div className={`step-indicator step-indicator--${orientation}`}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = allowClickPrevious && index < currentStep && onStepClick;

        return (
          <div
            key={step.id}
            className={`step ${isActive ? 'step--active' : ''} ${isCompleted ? 'step--completed' : ''} ${isClickable ? 'step--clickable' : ''}`}
            onClick={() => handleStepClick(index)}
          >
            <div className="step-circle">
              {isCompleted ? (
                <span className="step-check">✓</span>
              ) : step.icon ? (
                step.icon
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </div>
            <div className="step-content">
              <span className="step-label">{step.label}</span>
              {step.description && (
                <span className="step-description">{step.description}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${isCompleted ? 'step-connector--completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
