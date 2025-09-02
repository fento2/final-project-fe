"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Briefcase, MapPin, BanknoteIcon, CalendarDays } from "lucide-react";
import ManagePostings from "../[slug]/components/ManagePostings";
import { useRouter } from "next/navigation";

export default function JobPostingsCard({ job }: { job: any }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/postings/${job.slug}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="hover:shadow-lg transition flex flex-col justify-between relative cursor-pointer"
    >
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col gap-3">
        {/* Badge jobType */}
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
          {job.jobType}
        </span>

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
          <span>{job.category}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={18} />
          <span>{job.location}</span>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BanknoteIcon size={18} />
          <span>{job.salary}</span>
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
      </CardContent>

      {/* Footer */}
      <CardFooter
        className="absolute top-0 right-1.5 z-10"
        onClick={(e) => e.stopPropagation()} // ⬅️ biar klik button nggak ikut trigger card
      >
        <ManagePostings slug={job.slug} />
      </CardFooter>
    </Card>
  );
}
