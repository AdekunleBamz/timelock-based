import './HeroSection.css';
import { Button } from './Button';

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Secure Your Assets with <span className="hero-highlight">Time-Locked</span> Deposits
        </h1>
        <p className="hero-description">
          Earn competitive rewards by locking your USDC for flexible durations.
          Built on Base with smart contract security.
        </p>
        <div className="hero-actions">
          <Button size="large" onClick={onGetStarted}>
            Get Started
          </Button>
          <Button size="large" variant="secondary" onClick={onLearnMore}>
            Learn More
          </Button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">$2.5M+</div>
            <div className="hero-stat-label">Total Value Locked</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">12% APY</div>
            <div className="hero-stat-label">Average Returns</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">1,500+</div>
            <div className="hero-stat-label">Active Users</div>
          </div>
        </div>
      </div>
    </section>
  );
}
