import { BriefcaseBusiness, Star, UsersRound } from "lucide-react";
import Image from "next/image";

type TopCompanyCardProps = {
    logo: string;
    name: string;
    rating: number;
    employees: number;
    jobsOpen: number;
    reviewCount?: number;
};

export function TopCompanyCard({
    logo,
    name,
    rating,
    employees,
    jobsOpen,
    reviewCount = 0,
}: TopCompanyCardProps) {
    return (
        <div className="flex items-center gap-4 group-hover:bg-gray-50 p-4 rounded-xl transition-colors">
            {/* Logo */}
            <Image
                src={logo || "https://images.unsplash.com/photo-1662057168154-89300791ad6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBjb21wYW55fGVufDB8fDB8fHww"}
                width={56}
                height={56}
                alt={name}
                className="w-14 h-14 object-contain rounded-xl border border-gray-200"
            />

            {/* Info */}
            <div className="flex-1">
                {/* Nama + Rating */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{name}</h3>
                        <div className="text-sm text-gray-600">
                            {reviewCount > 0 ? `${reviewCount} reviews` : 'Incorporation'}
                        </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                        {rating > 0 ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < rating ? "currentColor" : "none"}
                                    stroke="currentColor"
                                />
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">No rating</span>
                        )}
                    </div>
                </div>

                {/* Employees + Jobs */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <UsersRound size={16} />
                        <span>
                            {employees > 0 ? `${employees.toLocaleString()} employees` : 'No data'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BriefcaseBusiness size={16} />
                        <span className="font-medium text-gray-700">
                            {jobsOpen > 0 ? `${jobsOpen} jobs open` : 'No openings'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}