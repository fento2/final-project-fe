import React from 'react';
import { Bookmark, ShieldX } from 'lucide-react';

interface EmptyStateProps {
    error?: string | null;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ error }) => {
    if (error) {
        return (
            <div className="text-center py-12">
                <ShieldX className="mx-auto h-16 w-16 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="text-center py-12">
            <Bookmark className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
            <p className="text-gray-500 mb-6">
                Start exploring jobs and save the ones you're interested in to see them here.
            </p>
            <a
                href="/jobs/browse"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Browse Jobs
            </a>
        </div>
    );
};