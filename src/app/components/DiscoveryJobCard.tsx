"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Bookmark } from "lucide-react";

interface Job {
    id: string | number;
    company: string;
    logo?: string;
    postedDate?: string;
    location?: string;
    salary?: string;
    title: string;
    type?: string;
    description?: string;
    requirements?: string[];
    lat?: number;
    lng?: number;
}

interface JobCardProps {
    job: Job;
    index: number;
    coords: { lat: number; lng: number } | null;
}

const JobCard: React.FC<JobCardProps> = ({ job, index, coords }) => {
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

    return (
        <Card
            className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl"
            style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            <div className="p-6">
                {/* Job Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{job.title}</h3>

                {/* Company Info with Logo */}
                <div className="flex items-center gap-3 mb-4">
                    {/* Company Logo - using a colorful geometric shape */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)'
                        }}>
                        <div className="w-8 h-8 bg-white rounded opacity-90 flex items-center justify-center">
                            <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-indigo-500 rounded"></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700 text-sm">{job.company}</h4>
                    </div>
                </div>

                {/* Job Type Badge */}
                <div className="mb-4">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 font-medium px-3 py-1">
                        {job.type || 'Full Time'}
                    </Badge>
                </div>

                {/* Requirements List */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-6">
                        <ul className="space-y-2">
                            {job.requirements.slice(0, 3).map((req, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start">
                                    <span className="text-gray-400 mr-2 mt-1">•</span>
                                    <span className="leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                    {distance && (
                        <span className="text-indigo-600 font-medium">({distance})</span>
                    )}
                </div>

                {/* Salary */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg h-10"
                        size="sm"
                    >
                        Apply This Job
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-300 hover:bg-gray-50 rounded-lg w-10 h-10 flex-shrink-0"
                    >
                        <Bookmark className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default JobCard;
