import { useThemeMode } from '../context/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { effectiveTheme, toggleTheme } = useThemeMode();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {effectiveTheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
