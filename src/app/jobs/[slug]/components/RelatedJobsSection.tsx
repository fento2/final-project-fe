import React from "react";
import SimilarJobCard from "./SimilarJobCard";

interface RelatedJobsSectionProps {
  relatedJobs: any[];
  displayJobId: string | number;
  loading: boolean;
}

const RelatedJobsSection: React.FC<RelatedJobsSectionProps> = ({ relatedJobs, displayJobId, loading }) => (
  <section className="mt-16">
    <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Jobs</h3>
    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedJobs
          .filter((job: any) => job.job_id !== displayJobId)
          .slice(0, 6)
          .map((job: any) => (
            <SimilarJobCard key={job.job_id} job={job} />
          ))}
      </div>
    )}
  </section>
);

export default RelatedJobsSection;
