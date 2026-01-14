import { useClipboard } from '../hooks';
import { Tooltip } from './Tooltip';
import './CopyButton.css';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label, className = '' }: CopyButtonProps) {
  const { copy, copied } = useClipboard({ timeout: 2000 });

  const handleClick = async () => {
    await copy(text);
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Click to copy'} position="top">
      <button
        type="button"
        className={`copy-button ${copied ? 'copied' : ''} ${className}`}
        onClick={handleClick}
        aria-label={label || 'Copy to clipboard'}
      >
        {copied ? (
          <span className="copy-icon">✓</span>
        ) : (
          <span className="copy-icon">📋</span>
        )}
        {label && <span className="copy-label">{label}</span>}
      </button>
    </Tooltip>
  );
}
