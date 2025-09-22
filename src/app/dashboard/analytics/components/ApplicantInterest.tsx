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
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import LoadingCard from "./LoadingCard";
import { toTitleCase } from "@/helper/toTitleCase";
import { Activity, Wallet } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Label as RechartsLabel,
} from "recharts";

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
                    <div className="flex flex-col gap-2 w-40">
                        <Label htmlFor="rangeFilter">Time Range</Label>
                        <Select
                            value={rangeFilter}
                            onValueChange={(val) =>
                                setRangeFilter(val as "7d" | "month" | "year" | "all")
                            }
                        >
                            <SelectTrigger id="rangeFilter" className="w-full">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Chart Content */}
                {loading ? (
                    <LoadingCard />
                ) : jobTypeData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada data untuk filter ini.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={600} className="bg-neutral-50 rounded-lg">
                        <LineChart
                            data={jobTypeData}
                            layout="vertical" // chart vertikal
                            margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />

                            <XAxis type="number">

                            </XAxis>

                            <YAxis type="category" dataKey="jobType" tickFormatter={(v) => toTitleCase(v)} />

                            <Tooltip
                                formatter={(value: number) => `${value} Applicants`}
                                labelFormatter={(v) => toTitleCase(v)}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="oklch(70.4% 0.191 22.216)"
                                strokeWidth={3}
                                dot={{ r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                )}
            </CardContent>
        </Card>
    );
};

export default ApplicantInterest;
