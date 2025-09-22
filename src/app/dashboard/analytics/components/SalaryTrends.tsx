"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/helper/apiCall";
import { toTitleCase } from "@/helper/toTitleCase";
import { JobType } from "@/types/database";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Label as RechartsLabel,
} from "recharts";
import LoadingCard from "./LoadingCard";

interface SalaryData {
    category: string;
    avgSalary: number;
}

const SalaryTrends = () => {
    const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
    const [loadingSalary, setLoadingSalary] = useState<boolean>(false);

    // filter state
    const [jobType, setJobType] = useState<JobType | "all">("all");
    const [range, setRange] = useState<"7d" | "month" | "year" | "all">("7d");
    const [filterCity, setFilterCity] = useState('all')
    const [cities, setCities] = useState([])

    // fetch salary trends
    const fetchSalaryTrends = async () => {
        try {
            setLoadingSalary(true);
            const { data } = await apiCall.get("/analytic/salary-trends", {
                params: {
                    jobType,
                    range,
                    city: filterCity
                },
            });
            if (data.success) {
                const salary = data.data.result.map((d: SalaryData) => ({
                    category: toTitleCase(d.category),
                    avgSalary: Math.ceil(d.avgSalary),
                }));
                setSalaryData(salary);
                setCities(data.data.cities)
                console.log(data)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSalary(false);
        }
    };

    useEffect(() => {
        fetchSalaryTrends();
    }, [jobType, range, filterCity]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <CardTitle>Salary Trends</CardTitle>
                </div>
                <CardDescription>
                    Analisis rata-rata gaji berdasarkan kategori pekerjaan.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-6 border-neutral-100 border-b pb-4">
                    <div className="flex flex-col gap-2 w-40">
                        <Label htmlFor="jobType">Job Type</Label>
                        <Select
                            value={jobType}
                            onValueChange={(v: JobType | "all") => setJobType(v)}
                        >
                            <SelectTrigger id="jobType" className="w-full">
                                <SelectValue placeholder="Pilih tipe pekerjaan" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                                <SelectItem value="all">All</SelectItem>
                                {Object.values(JobType).map((v) => (
                                    <SelectItem key={v} value={v}>
                                        {toTitleCase(v)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2 w-40">
                        <Label htmlFor="city">City</Label>
                        <Select
                            value={filterCity}
                            onValueChange={(v: string) => setFilterCity(v)}
                        >
                            <SelectTrigger id="city" className="w-full">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                                <SelectItem value="all">All</SelectItem>
                                {cities.map((v) => (
                                    <SelectItem key={v} value={v}>
                                        {toTitleCase(v)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2 w-40">
                        <Label htmlFor="range">Time Range</Label>
                        <Select
                            value={range}
                            onValueChange={(v: "7d" | "month" | "year" | "all") =>
                                setRange(v)
                            }
                        >
                            <SelectTrigger id="range" className="w-full">
                                <SelectValue placeholder="Pilih range waktu" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Chart / Loading / Empty State */}
                {loadingSalary ? (
                    <LoadingCard />
                ) : salaryData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Belum ada data untuk filter ini.
                    </p>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height={350}
                        className="bg-neutral-50 rounded-lg"
                    >
                        <BarChart
                            data={salaryData}
                            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />
                            <XAxis dataKey="category">
                                <RechartsLabel
                                    value="Job Category"
                                    offset={-20}
                                    position="insideBottom"
                                    style={{
                                        fill: "oklch(87.9% 0.169 91.605)",
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                />
                            </XAxis>
                            <YAxis
                                tickFormatter={(value: number) => {
                                    if (value >= 1_000_000) {
                                        return `Rp${(value / 1_000_000).toFixed(1)}Jt`;
                                    } else if (value >= 1_000) {
                                        return `Rp${(value / 1_000).toFixed(1)}Rb`;
                                    }
                                    return `Rp${value}`;
                                }}
                            >
                            </YAxis>
                            <Tooltip
                                formatter={(value: number) =>
                                    `Rp ${value.toLocaleString("id-ID")}`
                                }
                            />
                            <Bar
                                dataKey="avgSalary"
                                fill="oklch(76.9% 0.188 70.08)"
                                barSize={40}
                                name="Average Salary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default SalaryTrends;
