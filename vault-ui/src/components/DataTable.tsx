import './DataTable.css';
import type { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortKey?: keyof T | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: keyof T) => void;
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  stickyHeader = false,
}: DataTableProps<T>) {
  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key as keyof T);
    }
  };

  const getCellValue = (item: T, column: Column<T>, index: number): ReactNode => {
    if (column.render) {
      return column.render(item, index);
    }
    const value = item[column.key as keyof T];
    return value as ReactNode;
  };

  return (
    <div className={`data-table-wrapper ${stickyHeader ? 'data-table--sticky' : ''}`}>
      <table className="data-table">
        <thead className="data-table-head">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`data-table-th ${column.sortable ? 'data-table-th--sortable' : ''} data-table-align--${column.align ?? 'left'}`}
                style={{ width: column.width }}
                onClick={() => handleHeaderClick(column)}
              >
                {column.header}
                {column.sortable && sortKey === column.key && (
                  <span className="data-table-sort-indicator">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="data-table-body">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="data-table-loading">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={`data-table-row ${onRowClick ? 'data-table-row--clickable' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`data-table-td data-table-align--${column.align ?? 'left'}`}
                  >
                    {getCellValue(item, column, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
