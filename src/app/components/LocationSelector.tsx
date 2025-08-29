import React from "react";

interface LocationSelectorProps {
    selectedCity: string;
    cities: string[];
    onCityChange: (city: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    selectedCity,
    cities,
    onCityChange
}) => {
    return (
        <div className="mt-4 inline-flex items-center bg-white rounded-full shadow px-4 py-2">
            <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent outline-none text-indigo-600 font-semibold cursor-pointer"
            >
                {cities.map((c) => (
                    <option key={c} value={c} className="text-sm">
                        {c}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LocationSelector;
