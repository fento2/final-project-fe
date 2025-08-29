"use client";

import Artwork from "../components/ArtWork";
import SignupForm from "./components/SignupForm";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Form Section - Fixed left side */}
            <div className="w-full lg:w-1/2 px-6 py-12 flex flex-col justify-start overflow-y-auto">
                <SignupForm />
            </div>

            {/* Artwork Section - Fixed right side */}
            <div className="hidden lg:block lg:w-1/2 lg:fixed lg:right-0 lg:top-0 lg:h-screen">
                <Artwork />
            </div>

            {/* Mobile Artwork (shows on mobile only) */}
            <div className="lg:hidden w-full">
                <Artwork />
            </div>
        </div>
    )
};