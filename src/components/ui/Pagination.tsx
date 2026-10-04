'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Counter } from './Counter';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [20, 40, 60, 80, 100],
  itemLabel = 'pets',
  className = '',
}) => {
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(safeTotalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < safeTotalPages - 2) {
        pages.push('ellipsis-end');
      }
      pages.push(safeTotalPages);
    }

    return pages;
  };

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm ${className}`}
    >
      {/* Left: Summary and Page Size Selector */}
      <div className="flex items-center gap-3 text-slate-600 font-medium">
        <span>
          Showing <span className="font-bold text-slate-900">{startItem}</span> to{' '}
          <span className="font-bold text-slate-900">{endItem}</span> of{' '}
          <Counter end={totalItems} className="font-bold text-emerald-700" /> {itemLabel}
        </span>

        {onPageSizeChange && pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-500">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 select-none">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          title="First Page"
          aria-label="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 font-bold"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageItem, index) => {
            if (typeof pageItem === 'string') {
              return (
                <span
                  key={`${pageItem}-${index}`}
                  className="px-2 py-1 text-slate-400 font-bold tracking-widest text-xs"
                >
                  •••
                </span>
              );
            }

            const isCurrent = pageItem === currentPage;
            return (
              <button
                key={pageItem}
                type="button"
                onClick={() => onPageChange(pageItem)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-bold transition text-xs sm:text-sm flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageItem}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
          disabled={currentPage >= safeTotalPages}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 font-bold"
          title="Next Page"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage >= safeTotalPages}
          className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          title="Last Page"
          aria-label="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
