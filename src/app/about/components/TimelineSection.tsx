"use client";

import { CheckCircle } from "lucide-react";

const milestones = [
    {
        year: "2020",
        title: "The Beginning",
        description: "Founded with a mission to revolutionize job searching with AI-powered matching technology."
    },
    {
        year: "2021", 
        title: "Growth Phase",
        description: "Reached 10,000 active users and partnered with 100+ companies across various industries."
    },
    {
        year: "2022",
        title: "Innovation Leap",
        description: "Launched advanced skill assessment tools and personalized career path recommendations."
    },
    {
        year: "2023",
        title: "Market Leader",
        description: "Became the fastest-growing job platform with 50,000+ users and 95% satisfaction rate."
    },
    {
        year: "2024",
        title: "Global Expansion",
        description: "Expanded internationally and introduced enterprise solutions for large corporations."
    }
];

export default function TimelineSection() {
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        From a simple idea to a platform that's transforming careers worldwide.
                    </p>
                </div>
                
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    
                    {milestones.map((milestone, index) => (
                        <div key={index} className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            {/* Timeline Dot */}
                            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                            
                            {/* Content Card */}
                            <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                                    <div className="flex items-center mb-4">
                                        <CheckCircle className="w-6 h-6 text-indigo-600 mr-3" />
                                        <span className="text-2xl font-bold text-indigo-600">{milestone.year}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">{milestone.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
