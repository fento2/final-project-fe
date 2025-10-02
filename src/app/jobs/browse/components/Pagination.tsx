import React, { useState } from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
    const [showPageSelect, setShowPageSelect] = useState(false);

    const getPageNumbers = () => {
        const pages = [];
        // Responsive page display - fewer pages on mobile
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const showPages = isMobile ? 3 : 5;

        let start = Math.max(1, page - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start < showPages - 1) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const showFirstPage = pageNumbers[0] > 1;
    const showLastPage = pageNumbers[pageNumbers.length - 1] < totalPages;
    const showFirstEllipsis = pageNumbers[0] > 2;
    const showLastEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

    // Generate page options for dropdown
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex flex-col space-y-4 mt-8 px-4">
            {/* Mobile: Simple Previous/Next with page select */}
            <div className="flex sm:hidden items-center justify-between w-full">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                </button>

                {/* Page selector for mobile */}
                <div className="relative">
                    <button
                        onClick={() => setShowPageSelect(!showPageSelect)}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Page {page} of {totalPages}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {showPageSelect && (
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                            {pageOptions.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => {
                                        onChange(pageNum);
                                        setShowPageSelect(false);
                                    }}
                                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                                        pageNum === page ? 'bg-indigo-50 text-indigo-600' : ''
                                    }`}
                                >
                                    Page {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Desktop: Full pagination */}
            <div className="hidden sm:flex items-center justify-center">
                <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <button
                        onClick={() => onChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>

                    {/* First page */}
                    {showFirstPage && (
                        <>
                            <button
                                onClick={() => onChange(1)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                            >
                                1
                            </button>
                            {showFirstEllipsis && <span className="px-2 text-gray-400">...</span>}
                        </>
                    )}

                    {/* Page numbers */}
                    {pageNumbers.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onChange(pageNum)}
                            className={`px-3 py-2 text-sm border rounded-lg whitespace-nowrap ${
                                pageNum === page
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {/* Last page */}
                    {showLastPage && (
                        <>
                            {showLastEllipsis && <span className="px-2 text-gray-400">...</span>}
                            <button
                                onClick={() => onChange(totalPages)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={() => onChange(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        Next
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Page info for desktop */}
            <div className="hidden sm:block text-center text-sm text-gray-600">
                Page {page} of {totalPages}
            </div>
        </div>
    );
};