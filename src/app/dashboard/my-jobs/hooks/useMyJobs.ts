import { useState, useEffect } from "react";
import { apiCall } from "@/helper/apiCall";
import { toDateStartTimestamp } from "@/lib/formatDate";
import { Job } from "../types/job.types";
import { mapExperiencesToJobsWithLogos } from "../utils/jobUtils";

export function useMyJobs() {
    const [jobList, setJobList] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await apiCall.get("/experiences");
            const data: any[] = res?.data?.data ?? res?.data ?? [];
            const mapped = await mapExperiencesToJobsWithLogos(data);
            setJobList(mapped);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "Failed to load work history");
        } finally {
            setLoading(false);
        }
    };

    const addJob = async (job: Omit<Job, "companyLogo">) => {
        try {
            await apiCall.post("/experiences", {
                name: job.nameCompany,
                position: job.nameJob,
                startDate: toDateStartTimestamp(job.periodStart),
                endDate: job.periodEnd ? toDateStartTimestamp(job.periodEnd) : null,
                description: null,
            });
            await fetchJobs(); // refresh list
        } catch (e) {
            throw e; // let component handle error
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return {
        jobList,
        loading,
        error,
        fetchJobs,
        addJob,
    };
}