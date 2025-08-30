import { motion } from "framer-motion";

export function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-20">
            <motion.div 
                className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

export function LoadingCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 h-80"
                >
                    <div className="animate-pulse space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="pt-4 space-y-2">
                            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
