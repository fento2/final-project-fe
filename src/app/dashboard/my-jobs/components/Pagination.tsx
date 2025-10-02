interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
    const visible = 5;
    const half = Math.floor(visible / 2);
    let start = Math.max(1, page - half);
    let end = start + visible - 1;
    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - visible + 1);
    }
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="flex items-center justify-center gap-6 mt-2">
            <button
                onClick={() => onChange(Math.max(1, page - 1))}
                aria-label="Previous page"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div className="flex items-center gap-2">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        aria-current={p === page ? "page" : undefined}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition ${p === page
                            ? "bg-indigo-600 text-white rounded-lg shadow"
                            : "text-gray-700"
                            }`}
                    >
                        {p.toString().padStart(2, "0")}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onChange(Math.min(totalPages, page + 1))}
                aria-label="Next page"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}