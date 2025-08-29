"use client";

import React from "react";
import Image from "next/image";

const AboutUsSection: React.FC = () => {
    const features = [
        "Extensive Job Listings",
        "Easy Job Search",
        "User-Friendly Interface",
        "Mobile Compatibility",
        "Expert Customer Support",
        "Personalized Job Recommendation"
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Images */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-6 h-[500px]">
                            {/* Left column */}
                            <div className="flex flex-col gap-6">
                                {/* Top left image - larger */}
                                <div className="rounded-2xl overflow-hidden shadow-xl flex-1">
                                    <Image
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
                                        alt="Team collaboration"
                                        width={400}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Bottom left image - smaller */}
                                <div className="rounded-2xl overflow-hidden shadow-xl h-32">
                                    <Image
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
                                        alt="Remote work"
                                        width={400}
                                        height={200}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="flex flex-col gap-6">
                                {/* Top right image - smaller */}
                                <div className="rounded-2xl overflow-hidden shadow-xl h-32">
                                    <Image
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
                                        alt="Professional meeting"
                                        width={400}
                                        height={200}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Bottom right image - larger */}
                                <div className="rounded-2xl overflow-hidden shadow-xl flex-1">
                                    <Image
                                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
                                        alt="Job interview"
                                        width={400}
                                        height={300}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                We help{" "}
                                <span className="text-blue-600">job seekers</span>{" "}
                                and{" "}
                                <span className="text-blue-600">employers</span>{" "}
                                find their true perfect match.
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="w-6 h-6 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-gray-600 text-lg font-medium">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button className="text-gray-900 font-semibold text-lg hover:text-blue-600 transition-colors duration-200 border-b-2 border-gray-900 hover:border-blue-600 pb-1">
                                Learn More About Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
