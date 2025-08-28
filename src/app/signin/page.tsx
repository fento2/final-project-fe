"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, Mail, Lock, Github, Facebook } from "lucide-react";
import SocialButtons from "../components/SocialButtons";
import Artwork from "../components/ArtWork";
import FormAuth from "../components/FormAuth";
import Router from "next/router";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            // TODO: panggil API autentikasi
            console.log("submit", { email, password });
            Router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row justify-center items-start">
            {/* Left: Form */}
            <div className="w-full lg:max-w-xl px-6 py-12 flex flex-col justify-center order-last lg:order-first">
                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
                        {/* Welcome Back <span className="text-2xl">👋</span> */}
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-600 mb-8">
                        Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormAuth
                            email={email}
                            onEmailChange={(e) => setEmail(e.target.value)}
                            password={password}
                            onPasswordChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex justify-between items-center text-sm">
                            <Link href="#" className="text-indigo-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-60"
                            disabled={loading}
                        >
                            <LogIn size={16} />
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <hr className="flex-1 border-t" />
                        <span className="text-sm text-gray-400">Or</span>
                        <hr className="flex-1 border-t" />
                    </div>

                    <SocialButtons mode="signin" />

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't you have an account?{" "}
                        <Link href="/signup" className="text-indigo-600 hover:underline">
                            Sign up
                        </Link>
                    </p>

                    <p className="text-xs text-gray-400 mt-8 text-center">© 2025 ALL RIGHTS RESERVED</p>
                </div>
            </div>

            {/* Right: Artwork */}
            <Artwork />
        </div>
    );
}