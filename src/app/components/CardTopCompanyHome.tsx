import { Globe, BadgeCheck } from "lucide-react";
import Image from "next/image";

type TopCompanyCardProps = {
    logo: string;
    name: string;
    website?: string;
    verified?: boolean;
};

export function TopCompanyCard({
    logo,
    name,
    website,
    verified = false,
}: TopCompanyCardProps) {
    return (
        <div className="flex items-center gap-3 sm:gap-4 group-hover:bg-gray-50 p-3 sm:p-4 rounded-xl transition-colors">
            {/* Logo */}
            <Image
                src={logo || "https://images.unsplash.com/photo-1662057168154-89300791ad6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBjb21wYW55fGVufDB8fDB8fHww"}
                width={48}
                height={48}
                alt={name}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl border border-gray-200"
            />

            {/* Info */}
            <div className="flex-1">
                {/* Name + Verified */}
                <div className="flex items-start sm:items-center justify-between gap-2 mb-1 sm:mb-2">
                    <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">{name}</h3>
                    </div>
                    {verified && (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">
                            <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                    )}
                </div>

                {/* Website */}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Globe size={14} />
                    <span className="font-medium text-gray-700">
                        {website ? (
                            <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                                Visit Website
                            </a>
                        ) : (
                            'No website'
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}