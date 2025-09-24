"use client";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useRouter } from "next/navigation";

export default function CTA() {
    const { user } = useAuth();
    const { setShowSignUp } = useAuthUIStore();
    const router = useRouter();
    const { isLogin } = useAuthStore();
    const isLoggedIn = isLogin || !!user;

    const handleCTAClick = () => {
        if (!user) {
            setShowSignUp(true);
        } else {
            // User sudah login, bisa diarahkan ke dashboard atau halaman lain
            const { role } = useAuthStore.getState();
            router.push(role === "DEVELOPER" ? "/dashboard/list-skill-assessment" : role === "COMPANY" ? "/dashboard/company" : "/dashboard/profile");
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-6 pb-14">
            <div className="bg-indigo-950 text-indigo-50 rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {isLoggedIn ? "Explore more opportunities on your dashboard!" : "Join Horizon Jobs today and take the first step towards finding your dream job!"}
                </h3>
                <p className="text-indigo-200 mb-6 max-w-3xl">
                    {isLoggedIn 
                        ? "Continue your job search journey and discover new career opportunities that match your skills."
                        : "With our user-friendly platform and up-to-date job listings, you'll be on your way to a fulfilling career in no time. Sign up now and see what opportunities await!"
                    }
                </p>
                <button
                    onClick={handleCTAClick}
                    className="inline-flex bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                    {isLoggedIn ? "Go to Dashboard" : "Join Now"}
                </button>
            </div>
        </section>
    )
}