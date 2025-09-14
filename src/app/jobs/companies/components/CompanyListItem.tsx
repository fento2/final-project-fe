import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Building } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { type Company } from "../../../../helper/companyHelpers";

interface CompanyListItemProps {
    company: Company;
    onViewJobs?: (companyId: number) => void;
    onViewProfile?: (companyId: number) => void;
}

export function CompanyListItem({ company, onViewJobs, onViewProfile }: CompanyListItemProps) {
    const slug = company.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                        <Image
                            src={company.logo}
                            alt={company.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover"
                        />
                        {company.verified && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 sm:p-1">
                                <Building className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-lg sm:text-xl text-gray-800 truncate">{company.name}</h3>
                                <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">{company.description}</p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                                    <span className="truncate">{company.employees.toLocaleString()} employees</span>
                                    <span className="truncate">{company.location}</span>
                                    <span className="font-semibold text-indigo-600 truncate">{company.jobsOpen} jobs open</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs sm:text-sm font-semibold text-gray-700">{company.rating}.0</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={() => onViewJobs?.(company.id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
                                    >
                                        <span className="hidden sm:inline">View Jobs</span>
                                        <span className="sm:hidden">Jobs</span>
                                    </Button>
                                    <Link href={`/jobs/companies/${slug}`}>
                                        <Button 
                                            variant="outline"
                                            className="border-gray-200 hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
                                        >
                                            <span className="hidden sm:inline">Profile</span>
                                            <span className="sm:hidden">Profile</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
