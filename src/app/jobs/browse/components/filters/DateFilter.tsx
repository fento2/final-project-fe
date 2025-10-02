import React, { useState } from "react";

interface DateFilterProps {
    date: string;
    dateFrom?: string;
    dateTo?: string;
    stats: Record<string, number>;
    loading: boolean;
    onChange: (date: string, dateFrom?: string, dateTo?: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ 
    date, 
    dateFrom, 
    dateTo, 
    stats, 
    loading, 
    onChange 
}) => {
    const [showCustomDateRange, setShowCustomDateRange] = useState(date === "Custom Range");

    const handleDateChange = (selectedDate: string) => {
        if (selectedDate === "Custom Range") {
            setShowCustomDateRange(true);
            onChange(selectedDate, dateFrom, dateTo);
        } else {
            setShowCustomDateRange(false);
            onChange(selectedDate, "", "");
        }
    };

    const dateOptions = [
        "Last 24 hours", 
        "Last 3 days", 
        "Last 7 days", 
        "Last 1 month", 
        "Custom Range", 
        "Anytime"
    ];

    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Date Posted</h3>
            <div className="space-y-2">
                {loading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                    <>
                        {dateOptions.map((d) => {
                            const count = stats[d] || 0;
                            return (
                                <label 
                                    key={d} 
                                    className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="date"
                                            checked={date === d}
                                            onChange={() => handleDateChange(d)}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        <span className="text-gray-700">{d}</span>
                                    </div>
                                    {d !== "Custom Range" && (
                                        <span className="text-gray-400 text-xs">
                                            ({d === "Last 1 month" ? stats["Last 1 month"] || 0 : count})
                                        </span>
                                    )}
                                </label>
                            );
                        })}
                        
                        {/* Custom Date Range Inputs */}
                        {(showCustomDateRange || date === "Custom Range") && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        value={dateFrom || ""}
                                        onChange={(e) => onChange(date, e.target.value, dateTo)}
                                        className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        value={dateTo || ""}
                                        onChange={(e) => onChange(date, dateFrom, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};