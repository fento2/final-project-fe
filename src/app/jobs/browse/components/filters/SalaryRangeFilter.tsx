import React from "react";
import { formatCompactIDR, IDR_SALARY_RANGES } from "@/lib/currencyHelper";

interface SalaryRangeFilterProps {
    salaryMin: number;
    salaryMax: number;
    onChange: (salaryMin: number, salaryMax: number) => void;
}

export const SalaryRangeFilter: React.FC<SalaryRangeFilterProps> = ({ 
    salaryMin, 
    salaryMax, 
    onChange 
}) => {
    const handleMinSalaryChange = (value: number) => {
        const newMin = Math.min(value, salaryMax - IDR_SALARY_RANGES.step);
        onChange(newMin, salaryMax);
    };

    const handleMaxSalaryChange = (value: number) => {
        const newMax = Math.max(value, salaryMin + IDR_SALARY_RANGES.step);
        onChange(salaryMin, newMax);
    };

    const handleQuickSelect = (min: number, max: number) => {
        onChange(min, max);
    };

    const quickSelectRanges = [
        { min: 0, max: 10000000, label: "0-10 Jt" },
        { min: 10000000, max: 25000000, label: "10-25 Jt" },
        { min: 25000000, max: 50000000, label: "25-50 Jt" },
        { min: 0, max: 50000000, label: "Semua" }
    ];

    const currentMin = Math.min(salaryMin, salaryMax - IDR_SALARY_RANGES.step);
    const currentMax = Math.max(salaryMax, salaryMin + IDR_SALARY_RANGES.step);

    return (
        <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Gaji (IDR)</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                    <span>Gaji Min.</span>
                    <span>Gaji Max.</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <span>{formatCompactIDR(IDR_SALARY_RANGES.min)}</span>
                    <span>{formatCompactIDR(IDR_SALARY_RANGES.max)}</span>
                </div>

                {/* Dual Range Slider */}
                <div className="relative mt-4">
                    {/* Min Salary Slider */}
                    <input
                        type="range"
                        min={IDR_SALARY_RANGES.min}
                        max={IDR_SALARY_RANGES.max}
                        step={IDR_SALARY_RANGES.step}
                        value={currentMin}
                        onChange={(e) => handleMinSalaryChange(parseInt(e.target.value))}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10 range-slider"
                    />

                    {/* Max Salary Slider */}
                    <input
                        type="range"
                        min={IDR_SALARY_RANGES.min}
                        max={IDR_SALARY_RANGES.max}
                        step={IDR_SALARY_RANGES.step}
                        value={currentMax}
                        onChange={(e) => handleMaxSalaryChange(parseInt(e.target.value))}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 range-slider"
                    />

                    {/* Slider Track */}
                    <div className="relative w-full h-2 bg-gray-200 rounded-lg">
                        <div
                            className="absolute h-2 bg-indigo-600 rounded-lg"
                            style={{
                                left: `${((currentMin - IDR_SALARY_RANGES.min) / (IDR_SALARY_RANGES.max - IDR_SALARY_RANGES.min)) * 100}%`,
                                width: `${((currentMax - currentMin) / (IDR_SALARY_RANGES.max - IDR_SALARY_RANGES.min)) * 100}%`
                            }}
                        />
                    </div>
                </div>

                {/* Current Selection Display */}
                <div className="text-center mt-4">
                    <span className="text-xs text-gray-500">
                        {formatCompactIDR(currentMin)} - {formatCompactIDR(currentMax)}
                    </span>
                </div>

                {/* Quick Select Buttons */}
                <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-600 font-medium">Pilihan Cepat:</div>
                    <div className="flex flex-wrap gap-2">
                        {quickSelectRanges.map((range, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickSelect(range.min, range.max)}
                                className="px-3 py-1 text-xs bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors"
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS untuk styling range slider */}
            <style jsx>{`
                .range-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                }

                .range-slider::-webkit-slider-track {
                    background: transparent;
                }

                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                }

                .range-slider::-moz-range-track {
                    background: transparent;
                }

                .range-slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};