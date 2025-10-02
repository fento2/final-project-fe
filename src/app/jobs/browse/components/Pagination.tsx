import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

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

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ←
            </button>

            {/* First page */}
            {page > 3 && (
                <>
                    <button
                        onClick={() => onChange(1)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        1
                    </button>
                    {page > 4 && <span className="px-2">...</span>}
                </>
            )}

            {/* Page numbers */}
            {getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onChange(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-lg ${
                        pageNum === page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {pageNum}
                </button>
            ))}

            {/* Last page */}
            {page < totalPages - 2 && (
                <>
                    {page < totalPages - 3 && <span className="px-2">...</span>}
                    <button
                        onClick={() => onChange(totalPages)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                →
            </button>
        </div>
    );
};