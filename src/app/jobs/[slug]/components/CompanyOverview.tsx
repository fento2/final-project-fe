import React from "react";
import Image from "next/image";
import { Calendar, User, MapPin, CircleCheck } from "lucide-react";

interface CompanyOverviewProps {
  companyName: string;
  companyLogo: string;
  location: string;
  description?: string;
}

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ companyName, companyLogo, location, description }) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <div className="flex items-center gap-4 mb-6">
      {companyLogo ? (
        <Image src={companyLogo} alt={companyName} width={80} height={80} className="w-20 h-20 rounded-xl object-cover" />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-2xl font-bold text-gray-900">{companyName}</h4>
          <CircleCheck fill="blue" color="white" className="w-5 h-5" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Average 1-2 weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>50-100 employees</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
    <h5 className="font-bold text-gray-900 mb-3">Company Overview</h5>
    {description ? (
      <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&_*]:text-inherit" dangerouslySetInnerHTML={{ __html: description }} />
    ) : (
      <p className="text-gray-600">{companyName} is a forward-thinking company committed to innovation and excellence. We provide a collaborative work environment and opportunities for professional growth.</p>
    )}
  </div>
);

export default CompanyOverview;
