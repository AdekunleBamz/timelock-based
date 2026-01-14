import type { AnchorHTMLAttributes, ReactNode } from 'react';
import './ExternalLink.css';

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({
  href,
  children,
  showIcon = true,
  className = '',
  ...props
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`external-link ${className}`}
      {...props}
    >
      {children}
      {showIcon && <span className="external-link-icon" aria-hidden="true">↗</span>}
    </a>
  );
}

// Pre-configured external links
export function BaseScanLink({ 
  type, 
  value, 
  label 
}: { 
  type: 'tx' | 'address' | 'token'; 
  value: string; 
  label?: string;
}) {
  const baseUrl = 'https://basescan.org';
  const url = `${baseUrl}/${type}/${value}`;
  const displayLabel = label || (type === 'tx' ? 'View Transaction' : 'View on BaseScan');

  return <ExternalLink href={url}>{displayLabel}</ExternalLink>;
}
