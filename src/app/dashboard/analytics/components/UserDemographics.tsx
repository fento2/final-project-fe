'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiCall } from "@/helper/apiCall"
import { toTitleCase } from "@/helper/toTitleCase"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Label as RechartsLabel, } from "recharts"
import LoadingCard from "./LoadingCard"


interface AgeData {
    range: string;
    count: number;
}

interface LocationData {
    city: string;
    count: number;
}

const UserDemographics = () => {
    const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
    const [rangeFilter, setRangeFilter] = useState<"7d" | "month" | "year" | "all">("7d");

    const [ageData, setAgeData] = useState<AgeData[]>([]);
    const [locationData, setLocationData] = useState<LocationData[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);

    const [loadingAge, setLoadingAge] = useState<boolean>(false);
    const [loadingLocation, setLoadingLocation] = useState<boolean>(false);


    const fetchUserDemographics = async () => {
        try {
            setLoadingAge(true);
            setLoadingLocation(true);

            const params = new URLSearchParams();
            if (genderFilter !== "all") params.set("gender", genderFilter);
            params.set("range", rangeFilter);

            const { data } = await apiCall.get(`/analytic/user-demographics?${params.toString()}`);
            if (data.success) {
                setAgeData(data.data.ageData);
                setLocationData(data.data.locationData);
                setTotalUsers(data.data.total);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingAge(false);
            setLoadingLocation(false);
        }
    };

    useEffect(() => {
        fetchUserDemographics();

    }, [genderFilter, rangeFilter]);

    return (
        <>
            {/* User Demographics */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle>User Demographics</CardTitle>
                    </div>
                    <CardDescription>
                        Lihat distribusi pengguna berdasarkan gender dan rentang waktu yang dipilih.
                        Data ditampilkan dalam bentuk chart usia dan lokasi.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-6 border-neutral-100 border-b pb-4">
                        {/* Gender Filter */}
                        <div>
                            <Label className="mb-2 block">Gender</Label>
                            <Select
                                value={genderFilter}
                                onValueChange={(val) => setGenderFilter(val as "all" | "male" | "female")}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Range Filter */}
                        <div>
                            <Label className="mb-2 block">Time Range</Label>
                            <Select
                                value={rangeFilter}
                                onValueChange={(val) => setRangeFilter(val as "7d" | "month" | "year" | "all")}
                            >
                                <SelectTrigger className="w-[180px]">
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

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Chart Age */}
                        {loadingAge ? (
                            <LoadingCard />
                        ) : (
                            <ResponsiveContainer width="100%" height={300} className={'bg-neutral-50 rounded-lg'}>
                                <BarChart data={ageData} margin={{ top: 20, right: 20, bottom: 40, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />
                                    <XAxis dataKey="range" >
                                        <RechartsLabel
                                            value="Age Range"
                                            offset={-20}
                                            position="insideBottom"
                                            style={{ fill: "oklch(68.5% 0.169 237.323)", fontSize: 18, fontWeight: "bold" }}
                                        />
                                    </XAxis>
                                    <YAxis >
                                        <RechartsLabel
                                            value="Applicant"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ fill: "oklch(70.8% 0 0)", fontSize: 18, fontWeight: "bold" }}
                                        />
                                    </YAxis>
                                    <Tooltip labelFormatter={(v) => `${v} Age`} />
                                    <Bar dataKey="count" fill="oklch(68.5% 0.169 237.323)" barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}


                        {/* Chart Location */}
                        {loadingLocation ? (
                            <LoadingCard />
                        ) : (
                            <ResponsiveContainer width="100%" height={300} className={'bg-neutral-50 rounded-lg'}>
                                <BarChart data={locationData} margin={{ top: 20, right: 20, bottom: 40, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(70.8% 0 0)" />
                                    <XAxis dataKey="city" tickFormatter={(v) => toTitleCase(v)} >
                                        <RechartsLabel
                                            value="City"
                                            offset={-20}
                                            position="insideBottom"
                                            style={{ fill: "oklch(69.6% 0.17 162.48)", fontSize: 18, fontWeight: "bold" }}
                                        />
                                    </XAxis>
                                    <YAxis >
                                        <RechartsLabel
                                            value="Applicant"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ fill: "oklch(70.8% 0 0)", fontSize: 18, fontWeight: "bold" }}
                                        />
                                    </YAxis>
                                    <Tooltip labelFormatter={(v) => toTitleCase(v)} />
                                    <Bar
                                        dataKey="count"
                                        fill="oklch(69.6% 0.17 162.48)"
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <p className="mt-2 font-semibold">Total Users: {totalUsers}</p>
                </CardContent>
            </Card >
        </>
    )
}
export default UserDemographics