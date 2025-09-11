"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

import { useAuthRole } from "@/helper/authRole";
import { apiCall } from "@/helper/apiCall";
import JobPostingsCard from "./componetns/JobsPostingsCard";
import { PaginationDashboard } from "./componetns/PaginationDashboard";
import { toSEO, toTitleCase } from "@/helper/toTitleCase";
import debounce from "lodash.debounce";
import ButtonLoading from "./componetns/ButtonLoading";

const PostingsPage = () => {
  useAuthRole("COMPANY");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil nilai awal dari URL jika ada
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "desc");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

  const [postingList, setPostingList] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const perPage = 6;

  // update URL ketika state berubah
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", toSEO(search));
    if (sort) params.set("sort", sort);
    if (category) params.set("category", toSEO(category));

    params.set("page", currentPage.toString());
    params.set("limit", perPage.toString()); // limit

    router.replace(`/dashboard/postings?${params.toString()}`);
  }, [search, sort, category, currentPage, perPage, router]);

  // Fetch jobs
  const deboucedFetchJobs = useMemo(
    () => debounce((searchVal: string, sortVal: string, categoryVal: string, page: number) => {
      fetchJobs(searchVal, sortVal, categoryVal, page);
    }, 1000),
    []
  );

  // update fetchJobs untuk menerima semua filter
  const fetchJobs = async (search: string, sort: string, category: string, page: number) => {
    try {
      setLoading(true)
      const params = new URLSearchParams();
      params.set("search", search);
      params.set("sort", sort);
      params.set("category", category);
      params.set("page", page.toString());
      params.set("limit", perPage.toString());

      const { data } = await apiCall.get(`/postings/get?${params.toString()}`);

      setPostingList(data.data.data);
      setTotalPage(data.data.totalPage);
      setCategories(["all", ...data.data.categories]);
      console.log(data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  };

  // panggil debounce tiap kali salah satu filter berubah
  useEffect(() => {
    deboucedFetchJobs(search, sort, category, currentPage);

    return () => deboucedFetchJobs.cancel();
  }, [search, sort, category, currentPage]);
  ;

  return (
    <div className="md:px-20 px-4 space-y-6 container mx-auto my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage and review all job postings uploaded to the platform.
          </p>
        </div>
        <ButtonLoading url="/dashboard/postings/manage/create" icon={Plus} text="Create New Job" />
      </div>

      {/* Search & Filters */}
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
            className="py-6 !text-lg pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v)}>
            <SelectTrigger className="w-[150px] py-6 text-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className="py-4 text-lg">Desc</SelectItem>
              <SelectItem value="asc" className="py-4 text-lg">Asc</SelectItem>
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
                <SelectItem key={cat} value={cat} className="py-4 text-lg">{toTitleCase(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Grid */}
      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postingList.map((job, idx) => (
            <JobPostingsCard key={idx} job={job} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(perPage).fill(0).map((_, idx) => (
            <div key={idx} className="border rounded-2xl animate-pulse px-4 py-4">
              <div className="h-4 w-1/2 bg-gray-300 mb-2"></div>
              <div className="h-6 w-3/4 bg-gray-300 mb-2"></div>
              <div className="h-4 w-full bg-gray-300 mb-1"></div>
              <div className="h-4 w-full bg-gray-300 mb-1"></div>
              <div className="h-4 w-full bg-gray-300 mb-1"></div>
              <div className="h-4 w-1/2 bg-gray-300 mb-2"></div>
              <div className="h-6 w-3/4 bg-gray-300 mb-2"></div>
              <div className="h-4 w-full bg-gray-300 mb-1"></div>
              <div className="h-4 w-full bg-gray-300 mb-1"></div>
              <div className="h-4 w-1/2 bg-gray-300"></div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {!(totalPage <= 1) && <PaginationDashboard
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
      />}
    </div>
  );
};

export default PostingsPage;
