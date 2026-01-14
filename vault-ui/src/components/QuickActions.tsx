import './QuickActions.css';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

interface QuickActionsProps {
  actions: QuickAction[];
  layout?: 'grid' | 'list';
}

export function QuickActions({ actions, layout = 'grid' }: QuickActionsProps) {
  return (
    <div className={`quick-actions quick-actions--${layout}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          className={`quick-action-btn quick-action-btn--${action.variant || 'primary'}`}
          onClick={action.onClick}
        >
          <span className="quick-action-icon">{action.icon}</span>
          <div className="quick-action-content">
            <span className="quick-action-label">{action.label}</span>
            {action.description && (
              <span className="quick-action-description">{action.description}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
