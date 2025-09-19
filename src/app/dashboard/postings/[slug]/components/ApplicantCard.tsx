import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit2, MoreVertical, Mail, Wallet, User, GraduationCap, Calendar, Slash } from "lucide-react";
import { toTitleCase } from "@/helper/toTitleCase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SetStateAction } from "react";
import { ApplicantFrontend } from "./ApplicantsSection";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Status } from "../applicant/components/ApplicantAction";
import { cn } from "@/lib/utils";

type ApplicantCardProps = {
    applicants: ApplicantFrontend[];
    loading: boolean;
    showFilters: boolean;
    hasMore: boolean;
    setPage: (value: SetStateAction<number>) => void;
};

const ApplicantCard = ({ applicants, loading, showFilters, hasMore, setPage }: ApplicantCardProps) => {
    const router = useRouter()
    const params = useParams()
    const { slug } = params

    const bgBadge = {
        [Status.SUBMITTED]: "bg-yellow-100 text-yellow-800",
        [Status.INTERVIEW]: "bg-blue-100 text-blue-800",
        [Status.ACCEPTED]: "bg-green-100 text-green-800",
        [Status.REJECTED]: "bg-red-100 text-red-800",
    } as any;
    //skeleton Card
    const LoadingCard = () => (
        <div className="border p-4 rounded-md animate-pulse mb-3 flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            </div>
        </div>
    );

    return (
        <CardContent className={`relative overflow-y-auto   ${showFilters ? "max-h-[300px]" : "max-h-[550px]"} thin-scrollbar`}>
            <div className="sticky top-0 h-0.5 mb-2 rounded-md bg-gray-300"></div>
            {loading && applicants.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
            ) : applicants.length === 0 ? (
                <p className="text-center mt-4 text-muted-foreground">No applicants found.</p>
            ) : (
                <div className="space-y-4">
                    {applicants.map((app, idx) => (
                        <div
                            key={idx}
                            className="hover:shadow-lg transition-shadow cursor-pointer border rounded-lg"
                            onClick={() => router.push(`/dashboard/postings/${slug}/applicant?id=${app.application_id}`)}
                        >
                            <div className="flex gap-4 p-4 items-start">
                                {/* Avatar */}
                                <div className="space-y-4">
                                    <Avatar className="w-20 h-20 border">
                                        <AvatarImage src={app.profile_picture ?? "/default-avatar.png"} alt={app.name} />
                                        <AvatarFallback>{app.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <Badge className={cn(bgBadge[app.status], 'hover:bg-white hover:text-black')} >
                                        {app.status}
                                    </Badge>
                                </div>

                                {/* Info */}
                                <div className="flex-1 space-y-1">

                                    <h3 className="font-semibold text-lg">{app.name}</h3>

                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" /> {app.email}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm">
                                        <Wallet className="w-4 h-4" /> Expected Salary:{" "}
                                        <span className="font-medium">Rp {(app.expected_salary ?? 0).toLocaleString()}</span>
                                    </p>

                                    <p className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4" /> Age: <span className="font-medium">{app.age ?? "-"}</span> |{" "}
                                        {toTitleCase(app.gender ?? "-")}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm">
                                        <GraduationCap className="w-4 h-4" /> Education:{" "}
                                        <span className="font-medium">{toTitleCase(app.education ?? "-")}</span>
                                    </p>

                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" /> Applied on{" "}
                                        {new Date(app.appliedOn).toLocaleDateString()}
                                    </p>

                                    <p className="text-sm">
                                        Score: <span className="font-medium">{app.score ?? "-"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* See More Button */}
            {hasMore && !loading && (
                <div className="p-4 flex justify-center">
                    <Button
                        variant={'ghost'}
                        onClick={() => {
                            setPage((prev) => prev + 1);
                        }}
                    >
                        See More
                    </Button>
                </div>
            )}
            <div className="sticky bottom-0 h-0.5 mt-2 rounded-md bg-gray-300"></div>
        </CardContent>
    );
};

export default ApplicantCard;
