/**
 * React component prop types and common interfaces
 */

import { ReactNode, CSSProperties } from 'react';

// Base component props
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// Component size variants
export type Size = 'sm' | 'md' | 'lg';

// Component variant types
export type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

// Loading state
export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
}

// Error state
export interface ErrorProps {
  error?: string | null;
  onRetry?: () => void;
}

// Disabled state
export interface DisabledProps {
  disabled?: boolean;
}

// Async component props
export interface AsyncComponentProps extends LoadingProps, ErrorProps {
  data?: any;
}

// Form field props
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// Callback props
export interface CallbackProps {
  onClick?: () => void;
  onChange?: (value: any) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

// Pagination props
export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

// Sort props
export interface SortProps<T> {
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: keyof T, sortOrder: 'asc' | 'desc') => void;
}

// Filter props
export interface FilterProps {
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}

// Search props
export interface SearchProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

// Selection props
export interface SelectionProps<T> {
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
}

// Modal props
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
}

// Dialog props
export interface DialogProps extends ModalProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Menu item
export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

// Tab item
export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

// Breadcrumb item
export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

// Option item
export interface OptionItem<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type { ReactNode, CSSProperties };
