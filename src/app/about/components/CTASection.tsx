"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUIStore } from "@/lib/zustand/authUIASrore";
import { useState } from "react";

export default function CTASection() {
    const { user } = useAuth();
    const { setShowSignUp } = useAuthUIStore();
    const [showCompanyModal, setShowCompanyModal] = useState(false);

    const handleGetStarted = () => {
        if (!user) {
            setShowSignUp(true);
        }
    };

    const handlePostJob = () => {
        if (!user) {
            setShowCompanyModal(true);
        } else if (user.role !== 'COMPANY') {
            setShowCompanyModal(true);
        } else {
            // User adalah company, redirect ke dashboard
            window.location.href = "/dashboard/company";
        }
    };

    return (
        <>
            <section className="py-20 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                        Join thousands of professionals who trust Horizon Jobs to find their perfect career match.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {user ? (
                            <Link 
                                href="/jobs" 
                                className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Find Jobs
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        ) : (
                            <button 
                                onClick={handleGetStarted}
                                className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        )}
                        <button 
                            onClick={handlePostJob}
                            className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors duration-200"
                        >
                            Post a Job
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal untuk Company Login Required */}
            {showCompanyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Harus Login sebagai Role Company
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Untuk dapat memposting lowongan pekerjaan, Anda harus login sebagai akun company.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowCompanyModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCompanyModal(false);
                                        setShowSignUp(true);
                                    }}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    Daftar Company
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
