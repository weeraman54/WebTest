import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page numbers to show
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center px-3 py-2 rounded-lg transition-colors
          ${currentPage === 1 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
          }
        `}
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {/* First page if not in range */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="px-3 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-2 rounded-lg transition-colors
              ${page === currentPage
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Last page if not in range */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="px-3 py-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center px-3 py-2 rounded-lg transition-colors
          ${currentPage === totalPages 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
          }
        `}
      >
        Next
        <ChevronRightIcon className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
