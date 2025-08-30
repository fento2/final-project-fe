import { motion } from "framer-motion";
import Image from "next/image";
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
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Image
                            src={company.logo}
                            alt={company.name}
                            width={64}
                            height={64}
                            className="rounded-xl object-cover"
                        />
                        {company.verified && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Building className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">{company.name}</h3>
                                <p className="text-gray-600 mt-1">{company.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span>{company.employees.toLocaleString()} employees</span>
                                    <span>{company.location}</span>
                                    <span className="font-semibold text-indigo-600">{company.jobsOpen} jobs open</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-semibold text-gray-700">{company.rating}.0</span>
                                </div>
                                <Button 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={() => onViewJobs?.(company.id)}
                                >
                                    View Jobs
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
