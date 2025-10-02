"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";

interface University {
    name: string;
    domain: string;
}

interface Props {
    value: string;
    onChange: (val: string) => void;
}

const UniversityAutocomplete = ({ value, onChange }: Props) => {
    const [results, setResults] = useState<University[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

    const fetchUniversities = useMemo(
        () =>
            debounce(async (val: string) => {
                if (!val) {
                    setResults([]);
                    setShowDropdown(false);
                    return;
                }

                try {
                    const res = await axios.get(
                        `http://universities.hipolabs.com/search?name=${val}`
                    );

                    const universities: University[] = res.data
                        .slice(0, 5)
                        .map((u: any) => ({
                            name: u.name,
                            domain: u.web_pages[0]?.replace(/^https?:\/\//, ""),
                        }));

                    setResults(universities);
                    setShowDropdown(true);
                } catch (err) {
                    console.error(err);
                }
            }, 300),
        []
    );

    const handleInputChange = (val: string) => {
        onChange(val);
        setSelectedUniversity(null);
        fetchUniversities(val);
    };

    const handleSelect = (u: University) => {
        onChange(u.name);
        setSelectedUniversity(u);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full flex items-center gap-2 border rounded-md">
            {/* Logo di samping input */}
            {selectedUniversity?.domain && (
                <img
                    src={`https://logo.clearbit.com/${selectedUniversity.domain}`}
                    alt={selectedUniversity.name}
                    className="w-6 h-6 rounded-sm object-contain ml-2"
                />
            )}

            {/* Input */}
            <Input
                placeholder="Type university..."
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                className="!text-lg py-6 flex-1"
            />

            {/* Dropdown */}
            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {results.map((u, idx) => (
                        <div
                            key={`${u.name}-${idx}`}
                            onClick={() => handleSelect(u)}
                            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {u.domain && (
                                <img
                                    src={`https://logo.clearbit.com/${u.domain}`}
                                    alt={u.name}
                                    className="w-6 h-6 rounded-sm object-contain"
                                />
                            )}
                            <span>{u.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UniversityAutocomplete;
