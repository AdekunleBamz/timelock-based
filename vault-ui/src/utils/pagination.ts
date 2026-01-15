/**
 * Pagination utilities
 */

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Paginate array
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex,
    endIndex,
  };
}

/**
 * Get page numbers for pagination UI
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  if (currentPage <= halfVisible + 2) {
    // Near start
    for (let i = 2; i <= maxVisible - 2; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
  } else if (currentPage >= totalPages - halfVisible - 1) {
    // Near end
    pages.push('ellipsis');
    for (let i = totalPages - (maxVisible - 3); i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Middle
    pages.push('ellipsis');
    for (let i = currentPage - halfVisible + 2; i <= currentPage + halfVisible - 2; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}

/**
 * Calculate offset for API calls
 */
export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Get page from offset
 */
export function getPageFromOffset(offset: number, pageSize: number): number {
  return Math.floor(offset / pageSize) + 1;
}

/**
 * Cursor-based pagination helper
 */
export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function paginateByCursor<T extends { id: string }>(
  items: T[],
  cursor: string | null,
  pageSize: number
): CursorPaginationResult<T> {
  let startIndex = 0;

  if (cursor) {
    startIndex = items.findIndex(item => item.id === cursor);
    if (startIndex === -1) {
      startIndex = 0;
    } else {
      startIndex += 1; // Start after the cursor
    }
  }

  const data = items.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < items.length;
  const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return {
    data,
    nextCursor,
    hasMore,
  };
}

/**
 * Calculate items per page based on container height
 */
export function calculateItemsPerPage(
  containerHeight: number,
  itemHeight: number,
  buffer: number = 2
): number {
  const visibleItems = Math.floor(containerHeight / itemHeight);
  return Math.max(visibleItems + buffer, 5); // Minimum 5 items
}

/**
 * Get pagination summary text
 */
export function getPaginationSummary(config: PaginationConfig): string {
  const { currentPage, pageSize, totalItems } = config;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  
  return `Showing ${start}-${end} of ${totalItems}`;
}
