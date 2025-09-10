"use client";

import { HandHeart, Eye, Sparkles, Crown } from "lucide-react";

const values = [
    {
        icon: <HandHeart className="w-8 h-8 text-indigo-600" />,
        title: "People First", 
        description: "We believe every person deserves meaningful work that aligns with their values and goals."
    },
    {
        icon: <Eye className="w-8 h-8 text-indigo-600" />,
        title: "Trust & Transparency",
        description: "Building authentic relationships through honest communication and reliable service."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
        title: "Innovation",
        description: "Continuously improving our platform with cutting-edge technology and user feedback."
    },
    {
        icon: <Crown className="w-8 h-8 text-indigo-600" />,
        title: "Excellence",
        description: "Delivering exceptional results through attention to detail and commitment to quality."
    }
];

export default function ValuesSection() {
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Core Values</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        These principles guide everything we do and shape the culture we're building at Horizon Jobs.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-transparent hover:border-indigo-100">
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-700 transition-colors">{value.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-base">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
