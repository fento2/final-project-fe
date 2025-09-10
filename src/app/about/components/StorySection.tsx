"use client";

export default function StorySection() {
    return (
        <section className="py-20 lg:py-32 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Story</h2>
                    <p className="text-lg text-gray-600">
                        How we're transforming the way people find meaningful work
                    </p>
                </div>

                {/* Story Content */}
                <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
                    <div className="space-y-8 text-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Beginning</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Horizon Jobs was born from a simple observation: the job search process was broken. Too many talented individuals were struggling to find opportunities that matched their skills and aspirations, while companies were having difficulty connecting with the right candidates.
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Our founders, Marcus and Sarah, envisioned a platform that would use smart algorithms, intuitive design, and human empathy to create meaningful connections between job seekers and employers.
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Today</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                What started as a weekend project has grown into a community of over 50,000 professionals who trust us with their career journeys. Today, Horizon Jobs continues to evolve, always keeping our core mission at heart: helping every person find work that fulfills their potential.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Simple Stats */}
                <div className="mt-16 text-center">
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl font-bold text-indigo-600 mb-2">2020</div>
                            <div className="text-gray-600 text-sm">Founded</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
                            <div className="text-gray-600 text-sm">Professionals</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
                            <div className="text-gray-600 text-sm">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
