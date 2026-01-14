import './Footer.css';
import { SocialLinks } from './SocialLinks';
import { ExternalLink } from './ExternalLink';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Timelock Vault</h4>
          <p>Secure your crypto assets with time-locked deposits and earn rewards.</p>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li>
              <ExternalLink href="/docs">Documentation</ExternalLink>
            </li>
            <li>
              <ExternalLink href="/audit">Audit Report</ExternalLink>
            </li>
            <li>
              <ExternalLink href="/terms">Terms of Service</ExternalLink>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <SocialLinks variant="vertical" size="small" />
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Timelock Vault. All rights reserved.</p>
        <p className="footer-disclaimer">
          Use at your own risk. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
