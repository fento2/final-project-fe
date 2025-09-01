"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationDashboard } from "./componetns/PaginationDashboard";
import { jobs } from "./data/dataDummy";
import ManagePostings from "./componetns/ManagePostings";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BanknoteIcon,
  Briefcase,
  CalendarDays,
  MapPin,
  Plus,
  Search,
} from "lucide-react";

const PostingsPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const categories = ["all", ...new Set(jobs.map((job) => job.category))];

  const filteredJobs = jobs
    .filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.category.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === "all" ? true : job.category === category;

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const totalPages = Math.ceil(filteredJobs.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + perPage);

  return (
    <div className="md:px-20 px-4 space-y-6 container mx-auto my-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage and review all job postings uploaded to the platform.
          </p>
        </div>
        <Link href="/dashboard/postings/manage/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Posting
          </Button>
        </Link>
      </div>

      {/* Search, Sort & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search job..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="py-6 !text-lg pl-10" // tambahin padding kiri biar teks gak nutup ikon
          />
        </div>

        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v)}>
            <SelectTrigger className="w-[150px] py-6 text-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="py-4 text-lg">
                Newest
              </SelectItem>
              <SelectItem value="oldest" className="py-4 text-lg">
                Oldest
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] py-6 text-lg">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="py-4 text-lg">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedJobs.map((job, idx) => (
          <Card
            key={idx}
            className="hover:shadow-lg transition relative p-4 flex flex-col gap-3"
          >
            {/* Header: Title & Company */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>

            {/* Badge contract */}
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
              {job.jobType}
            </span>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {job.requirements.slice(0, 3).map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            )}

            {/* Category */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase size={20} />
              <span>{job.category}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={20} />
              <span>{job.location}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BanknoteIcon size={20} />
              <span>{job.salary}</span>
            </div>

            {/* Posted & Expired */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays size={16} />
              <span>
                Posted: {new Date(job.createdAt).toLocaleDateString()} |
                Expired:{" "}
                <span className="text-red-500">
                  {new Date(job.expiredAt).toLocaleDateString()}
                </span>
              </span>
            </div>
            <ManagePostings slug={job.slug} />
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <PaginationDashboard
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PostingsPage;
