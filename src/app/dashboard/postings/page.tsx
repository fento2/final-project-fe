"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuthRole } from "@/helper/authRole";
import { apiCall } from "@/helper/apiCall";
import JobPostingsCard from "./componetns/JobsPostingsCard";
import { PaginationDashboard } from "./componetns/PaginationDashboard";
import { toSEO } from "@/helper/toTitleCase";
import debounce from "lodash.debounce";
import ButtonLoading from "./componetns/ButtonLoading";
import FilterAndSearch from "./componetns/FilterAndSearch";

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

  const [showPreselection, setShowPreselection] = useState<boolean>(searchParams.get('only-preselection') === 'true')
  const [showNotExpired, setShowNotExpired] = useState<boolean>(searchParams.get('only-not-expired') === 'true')

  const perPage = 6;

  // update url ketika state berubah
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", toSEO(search));
    if (sort) params.set("sort", sort);
    if (category) params.set("category", toSEO(category));
    if (showPreselection) params.set('only-preselection', 'true')
    if (showNotExpired) params.set('only-not-expired', 'true')

    params.set("page", currentPage.toString());
    params.set("limit", perPage.toString()); // limit

    router.replace(`/dashboard/postings?${params.toString()}`);
  }, [search, sort, category, currentPage, perPage, router, showNotExpired, showPreselection]);

  // Fetch jobs
  const deboucedFetchJobs = useMemo(
    () => debounce((searchVal: string, sortVal: string, categoryVal: string, page: number, showNotExpired: boolean, showPreselection: boolean) => {
      fetchJobs(searchVal, sortVal, categoryVal, page, showNotExpired, showPreselection);
    }, 1000),
    []
  );

  // update fetchJobs untuk menerima semua filter
  const fetchJobs = async (search: string, sort: string, category: string, page: number, showNotExpired: boolean, showPreselection: boolean) => {
    try {
      setLoading(true)
      const params = new URLSearchParams();
      params.set("search", search);
      params.set("sort", sort);
      params.set("category", category);
      params.set("page", page.toString());
      params.set("limit", perPage.toString());
      if (showPreselection) params.set('onlyPreselection', 'true')
      if (showNotExpired) params.set('notExpired', 'true')

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
    deboucedFetchJobs(search, sort, category, currentPage, showNotExpired, showPreselection);

    return () => deboucedFetchJobs.cancel();
  }, [search, sort, category, currentPage, showNotExpired, showPreselection]);
  ;

  useEffect(() => {
    router.prefetch('/dashboard/postings/create')
    console.log('ini jalan')
  }, [])

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

      <FilterAndSearch search={search} setSearch={setSearch} setCurrentPage={setCurrentPage} showPreselection={showPreselection} setShowPreselection={setShowPreselection} showNotExpired={showNotExpired} setShowNotExpired={setShowNotExpired} category={category} setCategory={setCategory} categories={categories} sort={sort} setSort={setSort} />

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
