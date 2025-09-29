import React from "react";
import ReadOnlyQuill from "@/app/dashboard/components/ReadOnlyReactQuil";

interface JobDescriptionProps {
  description?: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
    {description ? (
      <ReadOnlyQuill value={description} className="text-base leading-relaxed text-gray-700" />
    ) : (
      <p className="text-gray-500 italic">No description available for this position.</p>
    )}
  </div>
);

export default JobDescription;
