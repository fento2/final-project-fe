"use client";
import { Globe, Star, UsersRound, MapPin, Award, TrendingUp, Building } from "lucide-react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

type TopCompanyCardProps = {
    id: number;
    logo: string;
    name: string;
    rating: number;
    employees: number;
    website?: string;
    location: string;
    industry: string;
    description: string;
    growth: number;
    verified: boolean;
    benefits: string[];
    onViewJobs?: (companyId: number) => void;
    onViewProfile?: (companyId: number) => void;
};

export function TopCompanyCard({
    id,
    logo,
    name,
    rating,
    employees,
    website,
    location,
    industry,
    description,
    growth,
    verified,
    benefits,
    onViewJobs,
    onViewProfile,
}: TopCompanyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <div className="p-6 shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 bg-white/90 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={logo}
                                width={48}
                                height={48}
                                alt={name}
                                className="w-12 h-12 object-cover rounded-xl"
                            />
                            {verified && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                    <Award className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 leading-tight">{name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <Building className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{industry}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{rating}.0</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow-0">
                    {description}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <UsersRound className="w-4 h-4" />
                        <span>{employees.toLocaleString()} employees</span>
                        <div className="flex items-center gap-1 ml-auto">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-xs font-medium">+{growth}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Globe className="w-4 h-4" />
                        {website ? (
                            <a 
                                href={website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors truncate"
                            >
                                {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </a>
                        ) : (
                            <span className="font-semibold text-gray-400">No website</span>
                        )}
                    </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {benefits.slice(0, 2).map((benefit, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {benefit}
                        </span>
                    ))}
                    {benefits.length > 2 && (
                        <span className="text-xs text-gray-400">+{benefits.length - 2} more</span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                    <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                        onClick={() => onViewJobs?.(id)}
                    >
                        View All Jobs
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full border-gray-200 hover:bg-gray-50 rounded-lg"
                        onClick={() => onViewProfile?.(id)}
                    >
                        Company Profile
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
