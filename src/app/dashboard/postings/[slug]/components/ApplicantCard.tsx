import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit2, MoreVertical } from "lucide-react";
import { toTitleCase } from "@/helper/toTitleCase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SetStateAction } from "react";
import { ApplicantFrontend } from "./ApplicantsSection";
import { useParams, useRouter } from "next/navigation";

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
        <CardContent className={`overflow-y-auto   ${showFilters ? "max-h-[244px]" : "max-h-[500px]"} thin-scrollbar`}>
            {loading && applicants.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
            ) : applicants.length === 0 ? (
                <p className="text-center mt-4 text-muted-foreground">No applicants found.</p>
            ) : (
                <div className="space-y-4">
                    {applicants.map((app, idx) => (
                        <div key={idx}
                            onClick={() => router.push(`/dashboard/postings/${slug}/applicant?id=${app.application_id}`)}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow flex gap-4 items-start cursor-pointer">
                            {/* Avatar */}
                            <Avatar className="w-16 h-16 flex-shrink-0">
                                <AvatarImage src={app.profile_picture ?? "/default-avatar.png"} alt={app.name} />
                                <AvatarFallback>{app.name?.[0]}</AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{app.name}</h3>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                                <p className="text-sm">Score: <span className="font-medium">{app.score ?? "-"}</span></p>
                                <p className="text-sm">Expected Salary: <span className="font-medium">Rp {(app.expected_salary ?? 0).toLocaleString()}</span></p>
                                <p className="text-sm">Age: <span className="font-medium">{app.age ?? "-"}</span></p>
                                <p className="text-sm">Gender: <span className="font-medium">{app.gender ?? "-"}</span></p>
                                <p className="text-sm">Education: <span className="font-medium">{toTitleCase(app.education ?? "-")}</span></p>
                                <p className="text-sm text-muted-foreground">Applied on {new Date(app.appliedOn).toLocaleDateString()}</p>
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
        </CardContent>
    );
};

export default ApplicantCard;
