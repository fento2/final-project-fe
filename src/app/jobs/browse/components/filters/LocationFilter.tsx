import React from "react";

interface LocationFilterProps {
    location: string[];
    stats: Record<string, number>;
    loading: boolean;
    onChange: (location: string[]) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ 
    location, 
    stats, 
    loading, 
    onChange 
}) => {
    const handleLocationChange = (locationItem: string) => {
        const newLocation = location.includes(locationItem)
            ? location.filter((x: string) => x !== locationItem)
            : [...location, locationItem];
        onChange(newLocation);
    };

    const topLocations = Object.entries(stats)
        .sort(([, a], [, b]) => b - a) // Sort by count descending
        .slice(0, 6); // Show top 6

    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Location</h3>
            <div className="space-y-2">
                {loading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                    topLocations.map(([locationItem, count]) => (
                        <label 
                            key={locationItem} 
                            className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={location.includes(locationItem)}
                                    onChange={() => handleLocationChange(locationItem)}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700">{locationItem}</span>
                            </div>
                            <span className="text-gray-400 text-xs">({count})</span>
                        </label>
                    ))
                )}
            </div>
            {Object.keys(stats).length > 6 && (
                <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-700 font-medium">
                    +{Object.keys(stats).length - 6} more
                </button>
            )}
        </div>
    );
};