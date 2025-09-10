"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Briefcase, MapPin, BanknoteIcon, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/helper/toTitleCase";

interface JobPosting {
  title: string;
  category: string;
  job_type: string;
  salary: number;
  periodSalary: string;
  currency: string;
  expiredAt: string | Date;
  latitude: string;
  longitude: string;
  location: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  company_id: number | null;
  slug: string;
  preselection_test: boolean;
  requirements?: string[];
  // company: string;
}

export default function JobPostingsCard({ job }: { job: JobPosting }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/postings/${job.slug}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-xl tracking-wide font-bold">{job.title}</CardTitle>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
          {toTitleCase(job.job_type)}
        </span>


      </CardHeader>
      {/* Content */}
      <CardContent className="flex flex-col gap-3">
        {/* <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
          New
        </div> */}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {job.requirements.slice(0, 3).map((req: string, idx: number) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        )}

        {/* Category */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase size={18} />
          <span>{toTitleCase(job.category)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={18} />
          <span>{job.location}</span>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BanknoteIcon size={18} />
          <span>
            {toTitleCase(job.currency)} {job.salary.toLocaleString()} / {toTitleCase(job.periodSalary)}
          </span>
        </div>

        {/* Posted & Expired */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays size={16} />
          <span>
            Posted: {new Date(job.createdAt).toLocaleDateString()} | Expired:{" "}
            <span className="text-red-500">
              {new Date(job.expiredAt).toLocaleDateString()}
            </span>
          </span>
        </div>

        {/* Preselection Test */}
        {job.preselection_test && (
          <span className="text-xs text-green-600 font-medium">
            Preselection Test Available
          </span>
        )}
      </CardContent>

      {/* Footer */}
      {/* <CardFooter
        className="absolute top-0 right-1.5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <ManagePostings slug={job.slug} />
      </CardFooter> */}
    </Card>
  );
}
