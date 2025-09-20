// components/FeatureJobCard.tsx
import { Calendar, MapPin, DollarSign, Clock, Building, Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import formatCurrency from "@/lib/formatCurrency";
import { useAuthStore } from "@/lib/zustand/authStore";
import { getCompanyDetailUrl } from "@/helper/companySlugHelper";
import { generateJobSlug } from "@/helper/slugHelper";

interface FeatureJobCardProps {
    company: string;
    logo: string;
    postedDate: string;
    location: string;
    salary: string | number | null;
    periodSalary?: string;
    currency?: string;
    title: string;
    type: string;
    description: string;
    daysLeft: number;
    slug?: string;
    jobId?: string | number;
}

const FeatureJobCard = ({
    company,
    logo,
    postedDate,
    location,
    salary,
    periodSalary,
    currency,
    title,
    type,
    description,
    daysLeft,
    slug,
    jobId,
}: FeatureJobCardProps) => {
    const router = useRouter();
    const { role, isLogin } = useAuthStore();

    // Only show apply functionality for USER role
    const canApplyJobs = isLogin && role === 'USER';

    const handleApplyClick = () => {
        if (!canApplyJobs) {
            console.warn('Job applications are only available for job seekers (USER role)');
            return;
        }
        
        // Navigate to application form
        const jobSlug = slug || generateJobSlug({
            title: title,
            company: company,
            jobType: type,
            category: 'general'
        });
        router.push(`/jobs/${jobSlug}/apply`);
    };

    const handleCompanyClick = () => {
        // Navigate to company detail page
        const companyData = { name: company };
        const companyUrl = getCompanyDetailUrl(companyData);
        router.push(companyUrl);
    };

    // Format salary to IDR using backend data (same as DiscoveryJobCard)
    const formatSalary = (salaryValue: string | number | null | undefined, currency?: string, period?: string) => {
        if (!salaryValue || salaryValue === "Competitive") return "Competitive";
        
        // Convert to string first
        const salaryString = String(salaryValue);
        
        // Extract numeric value from string like "$5000/month" or "5000"
        const numericValue = salaryString.replace(/[^0-9]/g, '');
        
        if (!numericValue || numericValue === '0') return "Competitive";
        
        const amount = parseInt(numericValue);
        
        // Default to IDR if no currency specified or if already in IDR
        if (!currency || currency === 'IDR') {
            const periodText = period === 'hour' ? 'jam' : period === 'week' ? 'minggu' : period === 'year' ? 'tahun' : 'bulan';
            return `${formatCurrency(amount)}/${periodText}`;
        }
        
        // Convert from USD to IDR if needed (around 15,000 IDR = 1 USD)
        const idrAmount = currency === 'USD' ? amount * 15000 : amount;
        const periodText = period === 'hour' ? 'jam' : period === 'week' ? 'minggu' : period === 'year' ? 'tahun' : 'bulan';
        
        return `${formatCurrency(idrAmount)}/${periodText}`;
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col border-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={logo}
                                alt={company}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded-xl"
                            />
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 text-sm">{company}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{postedDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md font-medium">
                            {type}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">4.8</span>
                        </div>
                    </div>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {title}
                </h3>

                {/* Location and Salary */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-green-600">{formatSalary(salary, currency, periodSalary)}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3">
                    {description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-600">
                            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                        </span>
                    </div>
                    
                    {canApplyJobs ? (
                        <button 
                            onClick={handleApplyClick}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 group-hover:scale-105"
                        >
                            Apply Now
                        </button>
                    ) : (
                        <button 
                            onClick={handleCompanyClick}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group-hover:scale-105"
                        >
                            View Company
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureJobCard;