import React from "react";
import { Briefcase, GraduationCap, Calendar, Hourglass } from "lucide-react";

interface JobSidebarProps {
  postedAt: string;
  lastActivity: string;
  closesAt: string;
  skills?: any[];
}

const JobSidebar: React.FC<JobSidebarProps> = ({ postedAt, lastActivity, closesAt, skills }) => (
  <aside className="lg:w-80 flex-shrink-0">
    {/* Posted Date Info */}
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="text-right text-sm text-gray-500 mb-4">
        <p>Posted {postedAt}</p>
        <p>Last activity {lastActivity}</p>
      </div>
    </div>
    {/* Job Overview Card */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Job Overview</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Briefcase className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <div className="font-semibold text-gray-900 text-sm">Career Level:</div>
            <div className="text-gray-700">Mid-Level</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <div className="font-semibold text-gray-900 text-sm">Qualification:</div>
            <div className="text-gray-700">Bachelor's degree in Computer Science, Web Development or related field</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <div className="font-semibold text-gray-900 text-sm">Years of Experience:</div>
            <div className="text-gray-700">3+ years of experience in Web Development</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Hourglass className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <div className="font-semibold text-gray-900 text-sm">Job Closed in:</div>
            <div className="text-gray-700">{closesAt}</div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="font-semibold text-gray-900 text-sm mb-3">Skills Specialization:</div>
        <div className="flex flex-wrap gap-2">
          {skills && Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill: any) => (
              <span key={skill.id || skill.name} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                {skill.name || skill}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No skills listed</span>
          )}
        </div>
      </div>
    </div>
  </aside>
);

export default JobSidebar;
