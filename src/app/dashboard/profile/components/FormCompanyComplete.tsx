"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";

interface Company {
    name: string;
    domain: string;
    logo?: string;
}

interface Props {
    value: string;
    onChange: (val: string) => void;
}

const CompanyAutocomplete = ({ value, onChange }: Props) => {
    const [results, setResults] = useState<Company[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    // Debounce API call
    const fetchCompanies = useMemo(
        () =>
            debounce(async (val: string) => {
                if (!val) {
                    setResults([]);
                    setShowDropdown(false);
                    return;
                }

                try {
                    const res = await axios.get(
                        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${val}`
                    );
                    if (!res.data) return;

                    const companies: Company[] = res.data.slice(0, 5).map((c: any) => ({
                        name: c.name,
                        domain: c.domain,
                        logo: c.logo,
                    }));

                    setResults(companies);
                    setShowDropdown(true);
                } catch (err) {

                }
            }, 500), // delay 500ms
        []
    );

    const handleInputChange = (val: string) => {
        onChange(val);
        setSelectedCompany(null);
        fetchCompanies(val);
    };

    const handleSelect = (company: Company) => {
        onChange(company.name);
        setSelectedCompany(company);
        setResults([]);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full flex items-center gap-2 border rounded-md">
            {/* Logo di samping input */}
            {selectedCompany?.logo && (
                <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className="w-6 h-6 rounded-sm object-contain ml-2"
                />
            )}

            {/* Input tetap menampilkan nama */}
            <Input
                placeholder="Type company..."
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                className="!text-lg py-6 flex-1"
            />

            {/* Dropdown suggestion */}
            {
                showDropdown && results.length > 0 && (
                    <div className="absolute top-full left-0 z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                        {results.map((c, idx) => (
                            <div
                                key={`${c.name}-${idx}`}
                                onClick={() => handleSelect(c)}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                            >
                                {c.logo && (
                                    <img
                                        src={c.logo}
                                        alt={c.name}
                                        className="w-6 h-6 rounded-sm object-contain"
                                    />
                                )}
                                <span>{c.name}</span>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
};

export default CompanyAutocomplete;
