import './LandingPage.css';
import { HeroSection } from '../components/HeroSection';
import { FeatureCard } from '../components/FeatureCard';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { APYCalculator } from '../components/APYCalculator';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      title: 'Secure Vaults',
      description: 'Your assets are protected by audited smart contracts on Base blockchain.',
      icon: '🔒',
    },
    {
      title: 'Flexible Terms',
      description: 'Choose lock durations from 7 days to 365 days based on your goals.',
      icon: '⏱️',
    },
    {
      title: 'Competitive APY',
      description: 'Earn up to 15% APY on your deposits with longer lock periods.',
      icon: '📈',
    },
    {
      title: 'Easy Withdrawals',
      description: 'Access your funds immediately after the lock period expires.',
      icon: '💰',
    },
  ];

  return (
    <div className="landing-page">
      <HeroSection
        onGetStarted={onGetStarted}
        onLearnMore={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      />

      <section id="features" className="features-section">
        <h2 className="section-title">Why Choose Timelock Vault?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>

      <section className="calculator-section">
        <APYCalculator />
      </section>

      <section className="faq-section">
        <FAQ />
      </section>

      <Footer />
    </div>
  );
}
