'use client';
import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import LoadingCard from "./LoadingCard";
import { Activity } from "lucide-react";
import SelectFilter from "./SelectFilter";
import GeneralBarChart from "./GeneralBarChart";

interface JobTypeCount {
    jobType: string;
    count: number;
}

const ApplicantInterest = () => {
    const [jobTypeData, setJobTypeData] = useState<JobTypeCount[]>([]);
    const [loading, setLoading] = useState(false);
    const [rangeFilter, setRangeFilter] = useState<"7d" | "month" | "year" | "all">("7d");

    const getMostJobType = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set("range", rangeFilter);
            const { data } = await apiCall.get(`/analytic/most-jobtype?${params.toString()}`);
            if (data.success) {
                setJobTypeData(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMostJobType();
    }, [rangeFilter]);

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>Applicant Interests</CardTitle>
                </div>
                <CardDescription>
                    Analisis minat pelamar berdasarkan tipe pekerjaan yang paling banyak dilamar.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Filter */}
                <div className="flex flex-col md:flex-row gap-6 border-b border-neutral-100 pb-4 mb-4">
                    <SelectFilter label="Time Range" value={rangeFilter} setValue={setRangeFilter} placeHolder="Select range" valueArray={['7d', 'month', 'year', 'all']} />
                </div>

                {/* Chart Content */}
                {loading ? (
                    <LoadingCard />
                ) : jobTypeData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada data untuk filter ini.</p>
                ) : (
                    <GeneralBarChart data={jobTypeData}
                        height={350}
                        dataKeyX="jobType"
                        label="Job Type"
                        colorLabel="oklch(64.5% 0.246 16.439"
                        dataKeyBar="count"
                        colorBar="oklch(64.5% 0.246 16.439)"
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default ApplicantInterest;
