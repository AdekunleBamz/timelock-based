import './SocialLinks.css';

interface SocialLinksProps {
  variant?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}

const socialData = [
  { name: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
  { name: 'Discord', url: 'https://discord.com', icon: '💬' },
  { name: 'Telegram', url: 'https://telegram.org', icon: '✈️' },
  { name: 'GitHub', url: 'https://github.com', icon: '📚' },
];

export function SocialLinks({ variant = 'horizontal', size = 'medium' }: SocialLinksProps) {
  return (
    <div className={`social-links social-links--${variant} social-links--${size}`}>
      {socialData.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={social.name}
        >
          <span className="social-icon">{social.icon}</span>
          <span className="social-name">{social.name}</span>
        </a>
      ))}
    </div>
  );
}
