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
    Bar,
    BarChart,
    PieChart,
    Pie,
    Cell,
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


    const RADIAN = Math.PI / 180;
    const COLUR = ["oklch(70.7% 0.165 254.624)", "oklch(69.6% 0.17 162.48)", "oklch(87.9% 0.169 91.605)", "oklch(64.6% 0.222 41.116)", "oklch(51.4% 0.222 16.935)", "oklch(43.9% 0 0)"]


    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        // Kalau persen = 0 → jangan render apa2
        if (!percent || percent === 0) return null;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-lg"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


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
                    <ResponsiveContainer width="100%" height={350} className={'bg-neutral-50 rounded-lg'}>
                        <BarChart data={jobTypeData} margin={{ top: 20, right: 20, bottom: 40, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />
                            <XAxis dataKey="jobType" tickFormatter={(v) => toTitleCase(v)} >
                                <RechartsLabel
                                    value="Job Type"
                                    offset={-20}
                                    position="insideBottom"
                                    style={{ fill: "oklch(64.5% 0.246 16.439)", fontSize: 18, fontWeight: "bold" }}
                                />
                            </XAxis>
                            <YAxis
                                // domain={[0, 500]}          // batas min & max
                                tickCount={6}              // jumlah garis bantu
                            // ticks={[0, 100, 200, 300, 400, 500]} // bisa custom manual juga
                            >
                            </YAxis>
                            <Tooltip labelFormatter={(v) => toTitleCase(v)} />
                            <Bar
                                dataKey="count"
                                fill="oklch(64.5% 0.246 16.439)"
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default ApplicantInterest;
