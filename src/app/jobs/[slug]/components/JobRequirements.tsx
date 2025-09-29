import React from "react";

interface JobRequirementsProps {
  skills?: any[];
}

const JobRequirements: React.FC<JobRequirementsProps> = ({ skills }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Skill Requirements</h3>
    {skills && Array.isArray(skills) && skills.length > 0 ? (
      <ul className="space-y-3">
        {skills.map((skill: any) => (
          <li key={skill.id || skill.name} className="flex items-start gap-3 text-gray-700">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>Proficiency in {skill.name || skill}</span>
          </li>
        ))}
        <li className="flex items-start gap-3 text-gray-700">
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
          <span>Strong problem-solving and analytical skills</span>
        </li>
        <li className="flex items-start gap-3 text-gray-700">
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
          <span>Ability to work collaboratively in a team environment</span>
        </li>
      </ul>
    ) : (
      <p className="text-gray-600">No specific requirements listed.</p>
    )}
  </div>
);

export default JobRequirements;
