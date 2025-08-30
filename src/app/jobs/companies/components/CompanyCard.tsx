import { motion } from "framer-motion";
import Image from "next/image";
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 bg-white/80 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={48}
                                height={48}
                                className="rounded-xl object-cover"
                            />
                            {company.verified && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                    <Award className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{company.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <Building className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">Founded {company.founded}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{company.rating}.0</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{company.employees.toLocaleString()} employees</span>
                        <div className="flex items-center gap-1 ml-auto">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-xs font-medium">+{company.growth}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">${company.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-semibold text-indigo-600">{company.jobsOpen} jobs open</span>
                    </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {company.benefits.slice(0, 2).map((benefit, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {benefit}
                        </span>
                    ))}
                    {company.benefits.length > 2 && (
                        <span className="text-xs text-gray-400">+{company.benefits.length - 2} more</span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                    <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                        onClick={() => onViewJobs?.(company.id)}
                    >
                        View All Jobs
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full border-gray-200 hover:bg-gray-50 rounded-lg"
                        onClick={() => onViewProfile?.(company.id)}
                    >
                        Company Profile
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
