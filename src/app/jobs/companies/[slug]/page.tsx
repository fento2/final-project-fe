"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Share2, Bookmark, } from "lucide-react";
import { apiCall } from "../../../../helper/apiCall";
import ReviewSection from "./_components/ReviewSection";
import AddUserCompanyModal from "@/app/dashboard/review-company/_components/AddUserCompanyModal";
import ReviewCompanyModal from "@/app/dashboard/review-company/_components/ReviewCompanyModal";
import { useEffect, useState } from "react";
import ReadOnlyQuill from "@/app/dashboard/components/ReadOnlyReactQuil";
import { UserCompanyItem } from "@/types/userCompany";
import { User } from "@/types/database";
import { Job } from "@/types/job";
import JobListCompany from "./_components/JobListCompany";
import AboutCompany from "./_components/AboutCompany";
import CTA from "./_components/CTA";
import formatCurrency from "@/lib/formatCurrency";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    Users: User;
};

export default function CompanyDetailPage() {
    const [openModalCreateReview, setOpenModalCreateReview] = useState<boolean>(false);
    const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [company, setCompany] = useState<Company>();
    const [userCompany, setUserCompany] = useState<UserCompanyItem | null>(null);
    const [loadingUserCompany, setLoadingUserCompany] = useState<boolean>(false);
    const { slug } = useParams();
    const { user } = useAuth();

    const fetchData = async () => {
        const result = await apiCall.get(`/company/name/${slug}`);
        setCompany(result.data.data);
    }

    const fetchUserCompany = async () => {
        if (!user || !company) return;
        
        setLoadingUserCompany(true);
        try {
            // Check if user has existing work experience with this company
            const result = await apiCall.get(`/user-companies`);
            const userCompanies = result.data?.data || [];
            const existingRelation = userCompanies.find((uc: UserCompanyItem) => 
                uc.company?.company_id === company.company_id
            );
            setUserCompany(existingRelation || null);
        } catch (error) {
            console.log("Error fetching user companies:", error);
        } finally {
            setLoadingUserCompany(false);
        }
    }

    const handleWriteReview = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (loadingUserCompany) {
            return; // Don't do anything while loading
        }

        if (userCompany) {
            // User already has work experience with this company, open review modal directly
            setOpenReviewModal(true);
        } else {
            // User doesn't have work experience, need to add it first
            setOpenModalCreateReview(true);
        }
    }

    const handleWorkExperienceAdded = () => {
        setOpenModalCreateReview(false);
        fetchUserCompany(); // Refresh user company data
        // After adding work experience, automatically open review modal
        setTimeout(() => {
            setOpenReviewModal(true);
        }, 500);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (company && user) {
            fetchUserCompany();
        }
    }, [company, user])

    if (!company) return null;

    const salaries = Array.from(new Set((company.job ?? []).map(j => j.salary)))
        .filter(salary => salary !== undefined && salary !== null);

    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 pt-6 text-sm text-gray-500">
                <nav className="flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                    <span>/</span>
                    <Link href="/jobs" className="hover:text-gray-700">Jobs</Link>
                    <span>/</span>
                    <Link href="/jobs/companies" className="hover:text-gray-700">Companies</Link>
                    <span>/</span>
                    <span className="text-gray-900">{company.name}</span>
                </nav>
            </div>

            {/* Header */}
            <header className="mt-4 border-b">
                <div className="relative max-w-7xl mx-auto px-6">
                    {/* Cover Image */}
                    <div className="relative h-56 w-full rounded-2xl overflow-hidden">
                        <Image src={company.profile_picture} alt={company.name} fill className="object-cover" />
                        <div className="absolute top-6 right-6">
                            <div className="bg-indigo-600 text-white px-3 py-2 rounded-full text-xs font-semibold shadow">
                                WE ARE HIRING
                            </div>
                        </div>
                    </div>

                    {/* Company Logo - Outside Card */}
                    <div className="flex items-start gap-6 pt-6 pb-6">
                        <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Image src={company.profile_picture} alt={`${company.name} logo`} width={96} height={96} className="object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{company.name}</h1>
                                    {company.Users.isVerfied && (
                                        <CheckCircle2 className="text-indigo-600" />
                                    )}
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                                    <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                        {company.job.length} Jobs Open - Available
                                    </span>
                                    {/* <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <MapPin className="w-4 h-4" /> [KOSONG]
                                    </span> */}
                                    <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        {formatCurrency(minSalary)} - {formatCurrency(maxSalary)} per month
                                    </span>
                                    {/* <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <Timer className="w-4 h-4" /> [KOSONG]
                                    </span> */}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-start md:self-auto">
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                    Contact This Company
                                </button>
                                <button className="p-2.5 rounded-xl border hover:bg-gray-50">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 rounded-xl border hover:bg-gray-50">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left content */}
                <div className="lg:col-span-2">
                    <section className="mb-8">
                        <ReadOnlyQuill value={company.description} />
                    </section>

                    <JobListCompany company={company} />
                </div>

                {/* Sidebar */}
                <div className="">
                    <AboutCompany 
                        company={company} 
                        onOpen={handleWriteReview} 
                        hasWorkExperience={!!userCompany}
                        loadingUserCompany={loadingUserCompany}
                    />
                </div>
            </main>

            {/* CTA */}
            <CTA />

            {/* REVIEW SECTION */}
            <div className="max-w-7xl mx-auto px-6 pb-14">
                <ReviewSection companyName={company.name} />
            </div>

            {company && (
                <AddUserCompanyModal 
                    item={{
                        company_id: company.company_id,
                        name: company.name,
                        email: company.email || null,
                        phone: company.phone || null,
                        description: company.description || null,
                        website: company.website || null,
                        profile_picture: company.profile_picture || null
                    }} 
                    isOpen={openModalCreateReview} 
                    onClose={() => setOpenModalCreateReview(false)} 
                    onSaved={handleWorkExperienceAdded}
                    title="Tambah Riwayat Kerja untuk Review"
                    description="Untuk menulis review, Anda perlu menambahkan riwayat kerja di perusahaan ini terlebih dahulu. Setelah itu, Anda dapat memberikan review."
                />
            )}
            
            {userCompany && (
                <ReviewCompanyModal
                    isOpen={openReviewModal}
                    item={userCompany}
                    onClose={() => setOpenReviewModal(false)}
                    onSaved={() => {
                        setOpenReviewModal(false);
                        // Optionally refresh the review section
                        window.location.reload();
                    }}
                />
            )}
            
            {/* Login Required Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Only User can Review</DialogTitle>
                        <DialogDescription>
                            Silakan daftar sebagai user terlebih dahulu untuk menulis review.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowLoginModal(false)}
                        >
                            Tutup
                        </Button>
                        <Button 
                            onClick={() => {
                                setShowLoginModal(false);
                                // Redirect to login page
                                window.location.href = '/';
                            }}
                        >
                            Home
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
