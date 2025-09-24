"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import React from 'react';
import Image from 'next/image';
import { Briefcase, Globe, Users, Clock, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CTA from '../contact/components/CTA';
import LocalizedPricing from './components/LocalizedPricing';
import { useAuth } from '@/hooks/useAuth';
import { useAuthUIStore } from '@/lib/zustand/authUIASrore';
import { useRouter } from 'next/navigation';

export default function ServicePage() {
    const { user } = useAuth();
    const { setShowSignUp } = useAuthUIStore();
    const router = useRouter();
    const { isLogin } = useAuthStore();
    const isLoggedIn = isLogin || !!user;

    const handleGetStarted = () => {
        if (!user) {
            setShowSignUp(true);
        } else {
            const { role } = useAuthStore.getState();
            router.push(role === "DEVELOPER" ? "/dashboard/list-skill-assessment" : role === "COMPANY" ? "/dashboard/company" : "/dashboard/profile");
        }
    };

    const handleTalkToSales = () => {
        router.push("/contact");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-40">
                    <Image src="/images/header_bg.png" alt="bg" fill className="object-cover" priority />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-6">Services that help you hire and grow faster</h1>
                        <p className="text-gray-600 mb-8">We provide end-to-end hiring solutions: job posting, candidate discovery, applicant tracking, and employer branding tools — all in one intuitive platform.</p>
                        <div className="flex justify-center gap-4">
                            <Button 
                                onClick={handleGetStarted}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md"
                            >
                                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                            </Button>
                            <Button 
                                onClick={handleTalkToSales}
                                className="bg-white border hover:bg-indigo-700 border-indigo-600 text-indigo-600 hover:text-white px-6 py-3 rounded-md"
                            >
                                Talk to Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

                    <LocalizedPricing />

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What we offer</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        <div className="w-12 h-12 rounded-md bg-indigo-50 flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Job Postings & Ads</h3>
                        <p className="text-gray-600 text-sm">Create attractive job posts and distribute them to multiple job boards with a single click.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        <div className="w-12 h-12 rounded-md bg-indigo-50 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Candidate Discovery</h3>
                        <p className="text-gray-600 text-sm">Search our talent pool with advanced filters to find the right candidates faster.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        <div className="w-12 h-12 rounded-md bg-indigo-50 flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Employer Branding</h3>
                        <p className="text-gray-600 text-sm">Showcase your company with custom profiles, photos, and employee testimonials.</p>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div className="bg-white py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How it works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mx-auto mb-4">
                                <Clock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h4 className="font-semibold mb-2">Post & Publish</h4>
                            <p className="text-sm text-gray-600">Draft your job and publish across channels in minutes.</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mx-auto mb-4">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h4 className="font-semibold mb-2">Shortlist</h4>
                            <p className="text-sm text-gray-600">Use powerful filters and AI suggestions to create a shortlist.</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mx-auto mb-4">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h4 className="font-semibold mb-2">Hire</h4>
                            <p className="text-sm text-gray-600">Manage interviews and offers — all inside the platform.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reuse CTA component */}
            <CTA />
        </div>
    );
}
