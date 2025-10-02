import React from 'react';

export const LoadingState: React.FC = () => {
    return (
        <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                            <div className="flex gap-4 mb-4">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-28"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};