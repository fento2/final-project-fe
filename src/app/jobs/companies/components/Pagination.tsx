import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-12"
        >
            <Button
                variant="outline"
                size="icon"
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
                return (
                    <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        className={`rounded-lg w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm ${
                            pageNumber === currentPage ? "bg-indigo-600 text-white" : ""
                        }`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber.toString().padStart(2, '0')}
                    </Button>
                );
            })}
            
            {/* Show more pages on larger screens */}
            <div className="hidden sm:flex gap-2">
                {Array.from({ length: Math.min(2, totalPages - 3) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 1, currentPage + 1)) + i;
                    if (pageNumber <= totalPages && pageNumber > currentPage + 1) {
                        return (
                            <Button
                                key={pageNumber}
                                variant={pageNumber === currentPage ? "default" : "outline"}
                                className={`rounded-lg min-w-[40px] ${
                                    pageNumber === currentPage ? "bg-indigo-600 text-white" : ""
                                }`}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber.toString().padStart(2, '0')}
                            </Button>
                        );
                    }
                    return null;
                })}
            </div>
            
            <Button
                variant="outline"
                size="icon"
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
        </motion.div>
    );
}
