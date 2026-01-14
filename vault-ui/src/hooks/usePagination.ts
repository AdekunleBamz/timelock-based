import { useState, useCallback, useEffect, useRef } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

export function usePagination(options: PaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 10, total: initialTotal = 0 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotalState] = useState(initialTotal);

  const totalPages = Math.ceil(total / pageSize) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, total - 1);

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback(
    (pageNum: number) => {
      setPage(Math.min(Math.max(pageNum, 1), totalPages));
    },
    [totalPages]
  );

  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page when page size changes
  }, []);

  const setTotal = useCallback((newTotal: number) => {
    setTotalState(newTotal);
    // Adjust current page if it would be out of bounds
    const newTotalPages = Math.ceil(newTotal / pageSize) || 1;
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  }, [page, pageSize]);

  const state: PaginationState = {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  };

  return {
    ...state,
    nextPage,
    prevPage,
    goToPage,
    firstPage,
    lastPage,
    setPage: goToPage,
    setPageSize: changePageSize,
    setTotal,
  };
}

// Hook for paginating local data
export function useLocalPagination<T>(items: T[], initialPageSize = 10) {
  const pagination = usePagination({
    initialPageSize,
    total: items.length,
  });

  // Update total when items change
  const prevLength = useRef(items.length);
  useEffect(() => {
    if (prevLength.current !== items.length) {
      pagination.setTotal(items.length);
      prevLength.current = items.length;
    }
  }, [items.length, pagination]);

  const paginatedItems = items.slice(
    pagination.startIndex,
    pagination.startIndex + pagination.pageSize
  );

  return {
    ...pagination,
    items: paginatedItems,
    allItems: items,
  };
}
