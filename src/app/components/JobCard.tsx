// components/JobCard.tsx
import { Calendar, MapPin, DollarSign } from "lucide-react";
import Image from "next/image";

interface FeatureJobCardProps {
    company: string;
    logo: string;
    postedDate: string;
    location: string;
    salary: string;
    title: string;
    type: string;
    description: string;
    daysLeft: number;
}

const FeatureJobCard = ({
    company,
    logo,
    postedDate,
    location,
    salary,
    title,
    type,
    description,
    daysLeft,
}: FeatureJobCardProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl">
            {/* Left Section */}
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <Image
                        src={logo}
                        alt={company}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                    />
                    <div>
                        <p className="font-semibold">{company}</p>
                        <p className="text-sm text-gray-500">{postedDate}</p>
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <MapPin size={16} /> {location}
                    </span>
                    <span className="flex items-center gap-1">
                        <DollarSign size={16} /> {salary}
                    </span>
                </div>

                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                    {type}
                </span>

                <p className="mt-3 text-gray-500 text-sm">{description}</p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 mt-6 md:mt-0 md:ml-6">
                <p className="text-sm text-gray-500">Job Closed in</p>
                <h2 className="text-4xl font-bold text-indigo-600">{daysLeft}</h2>
                <p className="text-xs text-gray-500">DAYS</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default FeatureJobCard;
