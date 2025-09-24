import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/helper/toTitleCase";
import { formatDateIDDateOnly } from "@/lib/formatDate";
// Minimal User type used in this component
type UserLite = {
    createdAt?: string;
};
import { Job } from "@/types/job";
import { UserCompanyItem } from "@/types/userCompany";
import { Building2, CalendarDays, Mail, MapPin, Phone, Users } from "lucide-react";

type Company = {
    company_id: number;
    name: string;
    email: string;
    phone: string;
    description: string;
    website: string;
    profile_picture: string;

    user_company: UserCompanyItem[];
    job: Job[];
    Users: UserLite;
};

type Props = {
    company: Company;
    onOpen?: () => void;
    hasWorkExperience?: boolean;
    loadingUserCompany?: boolean;
}

export default function AboutCompany({ company, onOpen, hasWorkExperience, loadingUserCompany }: Props) {
    return (
        <aside className="sticky top-30 lg:col-span-1 space-y-6">
            <div className="rounded-2xl border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                        <Building2 className="min-w-4 min-h-4 text-indigo-600 mt-1" />
                        <div>
                            <p className="text-gray-500">Primary Industry:</p>
                            <div className="flex flex-wrap gap-2">
                                {
                                    Array.from(new Set((company.job ?? [])
                                        .map(j => j.category)
                                        .filter(Boolean)))
                                        .map(val => <Badge key={val} variant="outline">{toTitleCase(val)}</Badge>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-indigo-600 mt-1" />
                        <div>
                            <p className="text-gray-500">Company Size:</p>
                            <p className="font-medium">{Math.round((company.user_company?.length ?? 0) / 2)} - {Math.round((company.user_company?.length ?? 0) * 1.5)} employees</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CalendarDays className="w-4 h-4 text-indigo-600 mt-1" />
                        <div>
                            <p className="text-gray-500">Founded in:</p>
                            <p className="font-medium">{company.Users?.createdAt ? formatDateIDDateOnly(company.Users.createdAt) : "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-700">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Contacts</h4>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-indigo-600" />
                        <span>{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        <span>{company.email}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="min-w-4 min-h-4 text-indigo-600 mt-1" />
                        <div className="flex flex-wrap gap-2">
                            {
                                Array.from(new Set((company.job ?? [])
                                    .map(j => j.location.split(",")[0])
                                    .filter(Boolean)))
                                    .map(val => <Badge key={val} variant="secondary">{val}</Badge>)
                            }
                        </div>
                    </div>
                </div>

                <button 
                    className="mt-6 w-full border rounded-xl py-2.5 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={() => onOpen?.()} 
                    disabled={loadingUserCompany}
                >
                    {loadingUserCompany 
                        ? "Loading..." 
                        : hasWorkExperience 
                            ? "Write Review" 
                            : "Write Review About Company"
                    }
                </button>

                <div className="mt-6 text-xs text-gray-500">
                    <p>Joined {company.Users?.createdAt ? formatDateIDDateOnly(company.Users.createdAt) : "-"}</p>
                </div>
            </div>
        </aside>
    )
}