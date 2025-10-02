import React from 'react';
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

interface NoResultsProps {
    query: string;
    location: string;
}

const NoResults: React.FC<NoResultsProps> = ({ query, location }) => {
    const router = useRouter();

    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <Briefcase className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <div className="text-gray-600 space-y-2">
                {query && location ? (
                    <p>
                        No jobs found for "<strong>{query}</strong>" in <strong>{location}</strong>.
                    </p>
                ) : query ? (
                    <p>
                        No jobs found matching "<strong>{query}</strong>".
                    </p>
                ) : location ? (
                    <p>
                        No jobs found in <strong>{location}</strong>.
                    </p>
                ) : (
                    <p>No jobs found matching your search criteria.</p>
                )}
                <p className="text-sm mt-3">
                    Try adjusting your search criteria:
                </p>
                <ul className="text-sm text-left max-w-md mx-auto space-y-1">
                    <li>• Use more general keywords</li>
                    {location && <li>• Try searching in nearby cities</li>}
                    <li>• Check spelling of job titles or company names</li>
                    <li>• Browse all available jobs without filters</li>
                </ul>
            </div>
            <button
                onClick={() => router.push('/jobs')}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Browse All Jobs
            </button>
        </div>
    );
};

export default NoResults;