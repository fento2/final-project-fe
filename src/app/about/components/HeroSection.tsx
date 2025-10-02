"use client";

export default function HeroSection() {
    return (
        <header className="relative isolate overflow-hidden bg-white">
            {/* Branded header background */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="/images/header_bg.png"
                    alt="About header background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white" />
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Eyebrow */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
                        About Us
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                        Get to know
                        <span className="ml-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Horizon Jobs
                        </span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                        We connect talented people with companies that value their potential—through transparent processes,
                        smart technology, and a human touch.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-md">
                        <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                            <div className="p-6 text-center">
                                <div className="text-3xl font-bold text-gray-900">50K+</div>
                                <div className="text-sm text-gray-600">Active Users</div>
                            </div>
                            <div className="p-6 text-center">
                                <div className="text-3xl font-bold text-gray-900">10K+</div>
                                <div className="text-sm text-gray-600">Partner Companies</div>
                            </div>
                            <div className="p-6 text-center">
                                <div className="text-3xl font-bold text-gray-900">95%</div>
                                <div className="text-sm text-gray-600">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
