"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dots_v2 } from "@/components/ui/spinner";
import debounce from "lodash.debounce";
import { apiCall } from "@/helper/apiCall";
import ApplicantCard from "./ApplicantCard";
import ApplicantFilter from "./FiltersApplicant";
import HeaderApplication from "./HeaderApplicationSection";
import { toSEO } from "@/helper/toTitleCase";
import { Status } from "../applicant/components/ApplicantAction";
import { useJobDetailStore } from "@/lib/zustand/detailJobStore";


export type ApplicantFrontend = {
    application_id: number;
    name: string | undefined;
    email: string | undefined;
    profile_picture: string | null;
    score: number | null;
    appliedOn: string;
    expected_salary: number;
    gender: string;
    education: string | null;
    age: number | null;
    cvUrl: string;
    status: string;
};

const ApplicantSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { slug } = useParams();
    const preSelectionTest = useJobDetailStore((state) => state.jobDetail?.preselection_test)

    const [showFilters, setShowFilters] = useState(false);


    // Filter & sorting states
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [minAge, setMinAge] = useState(searchParams.get("min-age") || "");
    const [maxAge, setMaxAge] = useState(searchParams.get("max-age") || "");
    const [minSalary, setMinSalary] = useState(searchParams.get("min-salary") || "");
    const [maxSalary, setMaxSalary] = useState(searchParams.get("max-salary") || "");
    const [education, setEducation] = useState(searchParams.get("education") || "all");
    const [sortBy, setSortBy] = useState(searchParams.get("sort-by") || "appliedOn");
    const [gender, setGender] = useState(searchParams.get("gender") || "all");
    const [status, setStatus] = useState(Status.SUBMITTED as string)
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
        (searchParams.get("sort-order") as "asc" | "desc") || "asc"
    );

    const [applicants, setApplicants] = useState<ApplicantFrontend[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 8;
    const [total, setTotal] = useState(0);

    // Debounce search input
    const debouncedSetSearch = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedSearch(value);
            }, 1000),
        []
    );
    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSetSearch(value);
    };

    // Fetch data
    const getData = async (reset = false, fetchPage = page) => {
        const offset = (fetchPage - 1) * limit;
        try {
            setLoading(true);

            const params = new URLSearchParams();
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (minAge) params.set("minAge", minAge);
            if (maxAge) params.set("maxAge", maxAge);
            if (minSalary) params.set("minSalary", minSalary);
            if (maxSalary) params.set("maxSalary", maxSalary);
            if (education !== "all") params.set("education", education);
            if (sortBy) params.set("sortBy", sortBy);
            if (gender) params.set("gender", gender);
            if (status) params.set("status", status);
            if (sortOrder) params.set("sortOrder", sortOrder);
            params.set("limit", limit.toString());
            params.set("offset", offset.toString());

            const { data } = await apiCall.get(`/applications/company/list/${slug}?${params.toString()}`);
            if (data.success) {
                if (reset) {
                    setApplicants(data.data.data);
                } else {
                    setApplicants((prev) => [...prev, ...data.data.data]);
                }
                setTotal(data.data.total);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    // Update URL query
    const updateUrl = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (minAge) params.set("min-age", minAge);
        if (maxAge) params.set("max-age", maxAge);
        if (minSalary) params.set("min-salary", minSalary);
        if (maxSalary) params.set("max-salary", maxSalary);
        if (education !== "all") params.set("education", education);
        if (sortBy) params.set("sort-by", sortBy);
        if (sortOrder) params.set("sort-order", sortOrder);
        if (gender !== "all") params.set("gender", toSEO(gender));
        if (status) params.set("status", toSEO(status));
        params.set("page", page.toString());
        router.replace(`?${params.toString()}`);
    };

    // Effects
    useEffect(() => {
        setPage(1);
        getData(true, 1);
    }, [debouncedSearch, minAge, maxAge, minSalary, maxSalary, education, sortBy, sortOrder, gender, status, preSelectionTest]);

    useEffect(() => {
        if (page === 1) return;
        getData();
    }, [page]);

    useEffect(() => {
        updateUrl();
    }, [search, minAge, maxAge, minSalary, maxSalary, education, sortBy, sortOrder, gender, page, status, preSelectionTest]);

    const hasMore = applicants.length < total;

    return (
        <Card className="sticky top-24">
            {/* Header */}
            <HeaderApplication
                total={total}
                search={search}
                onSearchChange={handleSearchChange}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Filters */}
            {showFilters && (
                <ApplicantFilter
                    minAge={minAge}
                    setMinAge={setMinAge}
                    maxAge={maxAge}
                    setMaxAge={setMaxAge}
                    minSalary={minSalary}
                    setMinSalary={setMinSalary}
                    maxSalary={maxSalary}
                    setMaxSalary={setMaxSalary}
                    gender={gender}
                    setGender={setGender}
                    status={status}
                    setStatus={setStatus}
                    education={education}
                    setEducation={setEducation}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
            )}

            {/* Applicants List */}
            <ApplicantCard
                applicants={applicants}
                loading={loading}
                showFilters={showFilters}
                hasMore={hasMore}
                setPage={setPage}
            />

            {loading && <div className="p-4 text-center text-gray-500"><Dots_v2 /></div>}
        </Card>
    );
};

export default ApplicantSection;
