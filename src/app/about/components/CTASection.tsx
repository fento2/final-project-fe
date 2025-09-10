"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Get Started?
                </h2>
                <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                    Join thousands of professionals who trust Horizon Jobs to find their perfect career match.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                        href="/jobs" 
                        className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Find Jobs
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link 
                        href="/dashboard/company" 
                        className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors duration-200"
                    >
                        Post a Job
                    </Link>
                </div>
            </div>
        </section>
    );
}
