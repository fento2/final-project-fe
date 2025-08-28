"use client";

import Artwork from "../components/ArtWork";
import SignupForm from "./components/SignupForm";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row justify-center items-start">
            {/* Artwork (tampil di atas di mobile) */}
            <Artwork />

            {/* Form (tampil di bawah di mobile) */}
            <div className="w-full lg:max-w-xl px-6 py-12 flex flex-col justify-center order-last lg:order-first">
                <SignupForm />
            </div>
        </div>
    )
};