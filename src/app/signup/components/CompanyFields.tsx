"use client";

import { Building2 } from "lucide-react";

type Props = {
    companyName: string;
    setCompanyName: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
};

export default function CompanyFields({ companyName, setCompanyName, phone, setPhone }: Props) {
    return (
        <>
            <label className="block text-sm">
                <span className="text-gray-700">Company name</span>
                <div className="mt-1 relative">
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your company name"
                        className="w-full pl-10 pr-3 py-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <Building2 className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>
            </label>

            <label className="block text-sm">
                <span className="text-gray-700">Phone number</span>
                <div className="mt-1 relative">
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 812 3456 7890"
                        className="w-full pl-3 pr-3 py-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>
            </label>
        </>
    );
}