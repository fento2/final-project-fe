import React from 'react';
import { Bookmark, MapPin, Banknote, Calendar, Briefcase, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { SavedJob } from '../types/savedJobTypes';
import formatCurrency from '@/lib/formatCurrency';
import { formatDateIDDateOnly } from '@/lib/formatDate';

interface SavedJobCardProps {
    savedJob: SavedJob;
    onJobClick: (job: SavedJob['Job']) => void;
    onUnsaveJob: (jobId: number) => void;
}

export const SavedJobCard: React.FC<SavedJobCardProps> = ({
    savedJob,
    onJobClick,
    onUnsaveJob
}) => {
    const { Job: job } = savedJob;

    return (
        <div 
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onJobClick(job)}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-lg bg-indigo-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {job.Company?.profile_picture ? (
                            <Image
                                src={job.Company.profile_picture}
                                alt={job.Company.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Briefcase className="w-8 h-8 text-indigo-600" />
                        )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {job.title}
                        </h3>

                        <p className="text-gray-600 mb-3">{job.Company?.name}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Banknote className="w-4 h-4" />
                                <span>{formatCurrency(job.salary, { currency: job.currency || 'IDR' })}/{job.periodSalary}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Saved {formatDateIDDateOnly(savedJob.createdAt)}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                                {job.job_type}
                            </span>
                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                {job.category}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUnsaveJob(job.job_id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Remove from saved jobs"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};