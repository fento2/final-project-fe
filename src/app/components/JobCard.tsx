// components/JobCard.tsx
import { Calendar, MapPin, DollarSign, Clock, Building, Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import formatCurrency from "@/lib/formatCurrency";

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

    const handleApplyClick = () => {
        const jobSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || jobId;
        router.push(`/jobs/${jobSlug}`);
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
                            <h4 className="font-bold text-gray-800 leading-tight">{company}</h4>
                            <div className="flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{postedDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Job Type Badge */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {type}
                    </span>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {title}
                </h3>

                {/* Job Info */}
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
                    
                    <button 
                        onClick={handleApplyClick}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 group-hover:scale-105"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FeatureJobCard;
