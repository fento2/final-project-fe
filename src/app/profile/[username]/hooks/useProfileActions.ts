import { useRouter } from "next/navigation";
import { useToast } from "@/components/basic-toast";
import { isCompanyUser, buildCompanySlug } from "@/helper/companySlugHelper";
import { Profile } from "../types/profile.types";

export function useProfileActions() {
    const router = useRouter();
    const toast = useToast();

    // Build absolute url for images
    const toAbsolute = (url?: string | null) => {
        if (!url || url === null) return "/images/logo.png";
        if (/^https?:\/\//i.test(url)) return url;
        const beBase = process.env.NEXT_PUBLIC_URL_BE || "";
        return beBase ? `${beBase}${url.startsWith("/") ? "" : "/"}${url}` : url;
    };

    // Handle contact/view profile action
    const handleContactOrViewProfile = (profile: Profile) => {
        if (!profile) return;

        // Check if user is a company
        if (isCompanyUser(profile)) {
            // Route to company detail page
            const companySlug = buildCompanySlug(profile);
            const companyUrl = `/jobs/companies/${companySlug}`;
            router.push(companyUrl);
        } else {
            // For regular users, open email client to contact them
            if (profile.email) {
                const displayName = profile?.name || profile?.username || "User";
                const subject = encodeURIComponent(`Job Opportunity - Contact from Job Portal`);
                const body = encodeURIComponent(`Hello ${displayName},\n\nI found your profile on our job portal and would like to discuss a potential opportunity with you.\n\nBest regards`);
                const mailtoUrl = `mailto:${profile.email}?subject=${subject}&body=${body}`;
                window.open(mailtoUrl, '_self');
            } else {
                toast.error(
                    "Email not available",
                    "This user hasn't provided a public email address."
                );
            }
        }
    };

    return {
        toAbsolute,
        handleContactOrViewProfile,
    };
}