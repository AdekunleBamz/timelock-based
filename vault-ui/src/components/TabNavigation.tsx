/**
 * Tab navigation component
 */

import { useState } from 'react';
import './TabNavigation.css';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: string;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  fullWidth?: boolean;
  className?: string;
}

export function TabNavigation({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`tab-navigation ${className}`}>
      <div
        className={`tab-navigation__tabs tab-navigation__tabs--${variant} ${
          fullWidth ? 'tab-navigation__tabs--full-width' : ''
        }`}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-navigation__tab ${
              activeTab === tab.id ? 'tab-navigation__tab--active' : ''
            } ${tab.disabled ? 'tab-navigation__tab--disabled' : ''}`}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tab-navigation__tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-navigation__content">{activeTabContent}</div>
    </div>
  );
}
