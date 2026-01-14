import './Pagination.css';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  
  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  // Always show first page
  pages.push(1);

  if (showLeftEllipsis) {
    pages.push('ellipsis');
  } else {
    // Show pages between 2 and leftSibling
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  // Show siblings and current
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }

  if (showRightEllipsis) {
    pages.push('ellipsis');
  } else {
    // Show pages between rightSibling and last page
    for (let i = rightSibling + 1; i < totalPages; i++) {
      pages.push(i);
    }
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
}: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages, siblingCount);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      {showFirstLast && (
        <Button
          variant="ghost"
          size="small"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          className="pagination-btn"
          aria-label="First page"
        >
          ««
        </Button>
      )}
      <Button
        variant="ghost"
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className="pagination-btn"
        aria-label="Previous page"
      >
        «
      </Button>

      <div className="pagination-pages">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-page ${page === currentPage ? 'pagination-page--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <Button
        variant="ghost"
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="pagination-btn"
        aria-label="Next page"
      >
        »
      </Button>
      {showFirstLast && (
        <Button
          variant="ghost"
          size="small"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="pagination-btn"
          aria-label="Last page"
        >
          »»
        </Button>
      )}
    </nav>
  );
}
