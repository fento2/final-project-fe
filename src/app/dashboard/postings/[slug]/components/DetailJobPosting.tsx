import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ManagePosting from "./ManagePostings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiCall } from "@/helper/apiCall";
import { useState, useEffect } from "react";
import { toTitleCase } from "@/helper/toTitleCase";
import ReadOnlyQuill from "@/app/dashboard/components/ReadOnlyReactQuil";

interface DetailJobPostring {
    addPreselection: boolean;
    setAddPreselection: (value: boolean) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IJobDetail {
    job_id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    salary: number;
    periodSalary: string; // enum diganti string
    currency: string;     // enum diganti string
    expiredAt: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    category: string;     // enum diganti string
    job_type: string;     // enum diganti string
    latitude: string;
    longitude: string;
    skills: {
        id: number;
        name: string;
    }[];
    company?: string;
}

const DetailPostingWithApplicant = ({
    addPreselection,
    setAddPreselection,
    handleFileUpload,
}: DetailJobPostring) => {
    const [job, setJob] = useState<IJobDetail | null>(null);
    const { slug } = useParams();




    // Fetch job detail dari backend
    const getDetailJob = async () => {
        try {
            const { data } = await apiCall.get(`/postings/get-detail/${slug}`);
            if (data.success) {
                setJob(data.data); // langsung set ke state
            }
        } catch (error) {
            console.log(error);
        }
    };

    // fetch data saat component mount
    useEffect(() => {
        getDetailJob();
    }, [slug]);


    if (!job) {
        return (
            <Card className="relative lg:col-span-2 border border-gray-200 shadow-md rounded-xl bg-white order-1 animate-pulse">
                <CardHeader className="px-6 pt-6">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent className="px-6 py-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="relative lg:col-span-2 border border-gray-200 shadow-md rounded-xl bg-white order-1">
                <CardHeader className=" px-6 pt-6">
                    <CardTitle className="text-3xl font-semibold">{job.title}</CardTitle>
                    {job.company && (
                        <p className="text-sm mt-1">{job.company}</p>
                    )}
                </CardHeader>
                <CardContent className="space-y-6 overflow-y-auto max-h-[650px] px-6 py-4">
                    {/* About This Job */}
                    <section className="mt-2">
                        <h2 className="text-lg font-bold tracking-widest mb-3 border-b border-gray-200 pb-2">
                            About This Job
                        </h2>
                        {/* <div
                            className="quill-preview prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        /> */}
                        <ReadOnlyQuill value={job.description} />
                    </section>


                    {/* Info Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {[
                            { label: "Category", value: toTitleCase(job.category) },
                            { label: "Location", value: job.location },
                            { label: "Salary", value: `${toTitleCase(job.currency)} ${job.salary.toLocaleString()} / ${toTitleCase(job.periodSalary)}` },
                            { label: "Type", value: toTitleCase(job.job_type) },
                            { label: "Posted", value: new Date(job.createdAt).toLocaleDateString() },
                            { label: "Expires", value: new Date(job.expiredAt).toLocaleDateString() },
                        ].map((info, idx) => (
                            <div key={idx} className="space-y-1">
                                <p className="text-md font-medium">{info.label}</p>
                                <p className="text-base">{info.value}</p>
                            </div>
                        ))}
                    </section>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <section className="mt-6">
                            <h2 className="text-lg font-semibold  mb-3 border-b border-gray-200 pb-2">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((s) => (
                                    <Badge
                                        key={s.id}
                                        variant="secondary"
                                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors rounded-full cursor-default"
                                    >
                                        {s.name}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Add Preselection */}
                    <section className="mt-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-medium">Add Preselection Test</Label>
                            <Switch
                                checked={addPreselection}
                                onCheckedChange={setAddPreselection}
                                className="bg-gray-300 data-[state=checked]:bg-indigo-500 relative rounded-full transition-colors"
                            >
                                <span
                                    className={`${addPreselection ? "translate-x-6" : "translate-x-0"} inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform`}
                                />
                            </Switch>
                        </div>

                        {addPreselection && (
                            <div className="space-y-2 mt-3">
                                <Input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="w-64 cursor-pointer"
                                    onChange={handleFileUpload}
                                />
                                <p className="text-sm text-gray-500">
                                    Upload the test questions in Excel format (.xlsx or .xls)
                                </p>
                            </div>
                        )}
                    </section>
                </CardContent>

                <ManagePosting slug={slug as string} />
            </Card>
        </>
    );
};

export default DetailPostingWithApplicant;
