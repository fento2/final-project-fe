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
            className="flex justify-center items-center gap-2 mt-12"
        >
            <Button
                variant="outline"
                size="icon"
                className="rounded-lg"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
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
            })}
            
            <Button
                variant="outline"
                size="icon"
                className="rounded-lg"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </motion.div>
    );
}
