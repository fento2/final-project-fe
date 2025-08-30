import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { Building } from "lucide-react";

interface EmptyStateProps {
    onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
        >
            <div className="text-gray-400 mb-4">
                <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
            <Button
                onClick={onClearFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
                Clear Filters
            </Button>
        </motion.div>
    );
}
