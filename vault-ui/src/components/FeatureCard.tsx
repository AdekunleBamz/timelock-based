import { Card } from './Card';
import './FeatureCard.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export function FeatureCard({ icon, title, description, highlight = false }: FeatureCardProps) {
  return (
    <Card 
      className={`feature-card ${highlight ? 'feature-card-highlight' : ''}`}
      variant="default" 
      padding="medium"
    >
      <span className="feature-card-icon">{icon}</span>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </Card>
  );
}

// Pre-configured feature cards for the app
export function FeatureMinDeposit() {
  return (
    <FeatureCard
      icon="💰"
      title="Low Minimum"
      description="Start with as little as 0.1 USDC"
    />
  );
}

export function FeatureFlexibleLock() {
  return (
    <FeatureCard
      icon="⏱️"
      title="Flexible Locks"
      description="Choose 3, 7, 14, or 30 day lock periods"
    />
  );
}

export function FeatureSecure() {
  return (
    <FeatureCard
      icon="🔐"
      title="Secure"
      description="Verified contracts on Base"
    />
  );
}

export function FeatureEmergency() {
  return (
    <FeatureCard
      icon="⚠️"
      title="Emergency Exit"
      description="10% penalty for early withdrawal"
      highlight
    />
  );
}
