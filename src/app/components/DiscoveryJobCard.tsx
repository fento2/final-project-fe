"use client";

import React from "react";
import { MapPin, DollarSign, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import formatCurrency from "@/lib/formatCurrency";
import { useAuthStore } from "@/lib/zustand/authStore";
import { getCompanyDetailUrl } from "@/helper/companySlugHelper";
import { generateJobSlug } from "@/helper/slugHelper";

interface Job {
    id: string | number;
    company: string;
    logo?: string;
    postedDate?: string;
    location?: string;
    salary?: string | number | null;
    periodSalary?: string;
    currency?: string;
    title: string;
    type?: string;
    description?: string;
    requirements?: string[];
    lat?: number;
    lng?: number;
    slug?: string;
}

interface JobCardProps {
    job: Job;
    index: number;
    coords: { lat: number; lng: number } | null;
}

const JobCard: React.FC<JobCardProps> = ({ job, index, coords }) => {
    const router = useRouter();
    const { role, isLogin } = useAuthStore();

    // Only show apply functionality for USER role
    const canApplyJobs = isLogin && role === 'USER';

    // Compute a safe job slug for navigation
    const jobSlug = job.slug || generateJobSlug({
        title: job.title,
        company: job.company,
        jobType: job.type,
        category: 'general',
    });

    const formatDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
    };

    const distance = coords && job.lat && job.lng
        ? formatDistance(coords.lat, coords.lng, job.lat, job.lng)
        : null;

    const handleApplyClick = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!canApplyJobs) {
            console.warn('Job applications are only available for job seekers (USER role)');
            return;
        }
        router.push(`/jobs/${jobSlug}/apply`);
    };

    const handleCompanyClick = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        // Navigate to company detail page
        const companyData = { name: job.company };
        const companyUrl = getCompanyDetailUrl(companyData);
        router.push(companyUrl);
    };

    const handleCardClick = () => {
        router.push(`/jobs/${jobSlug}`);
    };

    // Format salary to IDR using backend data
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

    // Calculate days left (random for demo, in real app would come from job data)
    const daysLeft = Math.floor(Math.random() * 30) + 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <div
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
                className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={job.logo || "https://images.unsplash.com/photo-1662057168154-89300791ad6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZ28lMjBjb21wYW55fGVufDB8fDB8fHww"}
                                alt={job.company}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded-xl"
                            />
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 leading-tight">{job.company}</h4>
                            <div className="flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{job.postedDate || "Recently"}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Job Type Badge */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {job.type || "Full-time"}
                    </span>
                </div>

                {/* Job Title */}
                <h3
                    className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                >
                    {job.title}
                </h3>

                {/* Job Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{job.location}</span>
                        {distance && (
                            <span className="text-indigo-600 font-medium">({distance})</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-green-600">{formatSalary(job.salary, job.currency, job.periodSalary)}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3">
                    {job.description || "No description available"}
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
                            onClick={(e) => handleApplyClick(e)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 group-hover:scale-105"
                        >
                            Apply Now
                        </button>
                    ) : (
                        <button 
                            onClick={(e) => handleCompanyClick(e)}
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

export default JobCard;
