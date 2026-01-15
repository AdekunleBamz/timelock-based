import { Section } from './Section';
import { Switch } from './Switch';
import { SelectInput } from './SelectInput';
import { Button } from './Button';
import { Divider } from './Divider';
import './SettingsPanel.css';

interface SettingsPanelProps {
  onClose?: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const slippageOptions = [
    { value: '0.1', label: '0.1%' },
    { value: '0.5', label: '0.5%' },
    { value: '1.0', label: '1.0%' },
    { value: '2.0', label: '2.0%' },
    { value: 'custom', label: 'Custom' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
  ];

  return (
    <div className="settings-panel">
      <Section title="⚙️ Settings">
        {onClose && (
          <button className="settings-close" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        )}

        <div className="settings-section">
          <h3 className="settings-section-title">Preferences</h3>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Notifications</span>
              <span className="settings-item-description">
                Get notified when deposits unlock
              </span>
            </div>
            <Switch
              checked={true}
              onChange={() => {}}
              aria-label="Toggle notifications"
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Auto-refresh</span>
              <span className="settings-item-description">
                Automatically refresh balances
              </span>
            </div>
            <Switch
              checked={true}
              onChange={() => {}}
              aria-label="Toggle auto-refresh"
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Compact mode</span>
              <span className="settings-item-description">
                Show more content in less space
              </span>
            </div>
            <Switch
              checked={false}
              onChange={() => {}}
              aria-label="Toggle compact mode"
            />
          </div>
        </div>

        <Divider />

        <div className="settings-section">
          <h3 className="settings-section-title">Transaction Settings</h3>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Slippage tolerance</span>
              <span className="settings-item-description">
                Maximum price difference before transaction fails
              </span>
            </div>
            <SelectInput
              options={slippageOptions}
              value="0.5"
              onChange={() => {}}
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Gas price</span>
              <span className="settings-item-description">
                Transaction speed preference
              </span>
            </div>
            <SelectInput
              options={[
                { value: 'slow', label: 'Slow' },
                { value: 'standard', label: 'Standard' },
                { value: 'fast', label: 'Fast' },
              ]}
              value="standard"
              onChange={() => {}}
            />
          </div>
        </div>

        <Divider />

        <div className="settings-section">
          <h3 className="settings-section-title">Display</h3>
          
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Language</span>
              <span className="settings-item-description">
                Choose your preferred language
              </span>
            </div>
            <SelectInput
              options={languageOptions}
              value="en"
              onChange={() => {}}
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Currency</span>
              <span className="settings-item-description">
                Display values in your currency
              </span>
            </div>
            <SelectInput
              options={[
                { value: 'usd', label: 'USD ($)' },
                { value: 'eur', label: 'EUR (€)' },
                { value: 'gbp', label: 'GBP (£)' },
              ]}
              value="usd"
              onChange={() => {}}
            />
          </div>
        </div>

        <Divider />

        <div className="settings-actions">
          <Button variant="outline" fullWidth>
            Reset to Defaults
          </Button>
          {onClose && (
            <Button variant="primary" fullWidth onClick={onClose}>
              Save Changes
            </Button>
          )}
        </div>
      </Section>
    </div>
  );
}
