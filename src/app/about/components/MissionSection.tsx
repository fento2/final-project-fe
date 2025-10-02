"use client";

import { Target, Eye, TrendingUp, Users, Building2, Award, Sparkles } from "lucide-react";

const achievements = [
    { number: "50,000+", label: "Active Job Seekers" },
    { number: "10,000+", label: "Partner Companies" },
    { number: "25,000+", label: "Successful Placements" },
    { number: "95%", label: "Satisfaction Rate" }
];

const foundationCards = [
    {
        icon: <Target className="w-8 h-8 text-indigo-600" />,
        title: "Our Mission",
        description: "To democratize access to meaningful career opportunities by connecting talented individuals with companies that value their unique skills and potential."
    },
    {
        icon: <Eye className="w-8 h-8 text-indigo-600" />,
        title: "Our Vision", 
        description: "A world where every professional finds work that not only pays the bills but also ignites their passion and contributes to their personal growth."
    },
    {
        icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
        title: "Our Impact",
        description: "Transforming careers, building stronger teams, and creating economic opportunities that benefit individuals, companies, and communities."
    }
];

export default function MissionSection() {
    return (
        <section className="py-20 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Foundation
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        The principles that guide our mission to connect talent with opportunity
                    </p>
                </div>

                {/* Mission, Vision, Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {foundationCards.map((card, index) => (
                        <div key={index} className="group text-center p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-xl mb-6 group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-300">
                                <div className="group-hover:text-white transition-colors duration-300">
                                    {card.icon}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {card.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Statistics Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">
                        Our Impact in Numbers
                    </h3>
                    <p className="text-indigo-100 mb-12 max-w-2xl mx-auto">
                        Real results that demonstrate our commitment to connecting talent with opportunity
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {achievements.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-indigo-100 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
