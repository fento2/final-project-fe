import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, MapPin, DollarSign, Briefcase, Building, Award, TrendingUp } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { type Company } from "../../../../helper/companyHelpers";

interface CompanyCardProps {
    company: Company;
    onViewJobs?: (companyId: number) => void;
    onViewProfile?: (companyId: number) => void;
}

export function CompanyCard({ company, onViewJobs, onViewProfile }: CompanyCardProps) {
    const slug = company.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 bg-white/80 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                            />
                            {company.verified && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 sm:p-1">
                                    <Award className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg leading-tight truncate">{company.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <Building className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-500 truncate">Founded {company.founded}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{company.rating}.0</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{company.description}</p>

                {/* Stats */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{company.employees.toLocaleString()} employees</span>
                        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-xs font-medium">+{company.growth}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-medium truncate">${company.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-semibold text-indigo-600 truncate">{company.jobsOpen} jobs open</span>
                    </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {company.benefits.slice(0, 2).map((benefit, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full truncate">
                            {benefit}
                        </span>
                    ))}
                    {company.benefits.length > 2 && (
                        <span className="text-xs text-gray-400 flex-shrink-0">+{company.benefits.length - 2} more</span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                    <Link href={`/jobs/companies/${slug}`}>
                        <Button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors text-xs sm:text-sm py-2"
                        >
                            View All Jobs
                        </Button>
                    </Link>
                    <Link href={`/jobs/companies/${slug}`}>
                        <Button 
                            variant="outline" 
                            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg text-xs sm:text-sm py-2"
                        >
                            Company Profile
                        </Button>
                    </Link>
                </div>
            </Card>
        </motion.div>
    );
}
