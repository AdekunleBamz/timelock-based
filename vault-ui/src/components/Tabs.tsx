import type { ReactNode } from 'react';
import './Tabs.css';
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  fullWidth = false,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab ?? tabs[0]?.id
  );
  
  const activeTab = controlledActiveTab ?? internalActiveTab;
  
  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };
  
  return (
    <div className={`tabs tabs--${variant} ${fullWidth ? 'tabs--full-width' : ''}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'tab--active' : ''} ${tab.disabled ? 'tab--disabled' : ''}`}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-disabled={tab.disabled}
          disabled={tab.disabled}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: ReactNode;
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (id !== activeTab) return null;
  
  return (
    <div 
      className="tab-panel" 
      role="tabpanel" 
      aria-labelledby={id}
    >
      {children}
    </div>
  );
}
