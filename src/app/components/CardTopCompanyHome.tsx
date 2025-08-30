import { BriefcaseBusiness, Star, UsersRound } from "lucide-react";
import Image from "next/image";

type TopCompanyCardProps = {
    logo: string;
    name: string;
    rating: number;
    employees: number;
    jobsOpen: number;
};

export function TopCompanyCard({
    logo,
    name,
    rating,
    employees,
    jobsOpen,
}: TopCompanyCardProps) {
    return (
        <div className="p-4 bg-white shadow rounded-xl flex items-start gap-4">
            {/* Logo */}
            <Image
                // src={logo}
                src="https://images.unsplash.com/photo-1662057168154-89300791ad6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBjb21wYW55fGVufDB8fDB8fHww"
                width={48}
                height={48}
                alt={name}
                className="w-12 h-12 object-contain"
            />

            {/* Info */}
            <div className="flex flex-col w-full">
                {/* Nama + Rating */}
                <div>
                    <h3 className="font-semibold">{name}</h3>
                    <div className="flex items-center text-yellow-500 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < rating ? "currentColor" : "none"}
                                stroke="currentColor"
                            />
                        ))}
                    </div>
                </div>

                {/* Employees + Jobs */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2 justify-between">
                    <div className="flex items-center gap-1"><UsersRound size={16} /><span>{employees} employees</span></div>
                    <div className="flex items-center gap-1"><BriefcaseBusiness size={16} /><span>{jobsOpen} jobs open</span></div>
                </div>
            </div>
        </div>
    );
}