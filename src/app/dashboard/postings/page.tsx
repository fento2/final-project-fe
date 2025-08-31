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
import { Plus } from "lucide-react";

const PostingsPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

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
        <Link href="/dashboard/postings/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Posting
          </Button>
        </Link>
      </div>

      {/* Search, Sort & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Input
          placeholder="Search job..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="sm:w-1/2 py-6 !text-lg"
        />

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

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition relative">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Category: {job.category}
              </p>
              <p className="text-sm text-muted-foreground">
                Location: {job.location}
              </p>
              <p className="text-sm text-muted-foreground">
                Salary: {job.salary}
              </p>
              <p className="text-xs text-muted-foreground">
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-red-500">
                Expired: {new Date(job.expiredAt).toLocaleDateString()}
              </p>
            </CardContent>
            <ManagePostings job={job} />
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
