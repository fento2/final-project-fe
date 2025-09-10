"use client";

import Image from "next/image";

const teamMembers = [
    {
        name: "Marcus Chen",
        role: "CEO & Co-Founder",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        bio: "Former tech recruiter with 10+ years of experience helping professionals find their dream careers."
    },
    {
        name: "Sarah Johnson",
        role: "CTO & Co-Founder", 
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
        bio: "Full-stack engineer passionate about building scalable platforms that connect talent with opportunity."
    },
    {
        name: "David Rodriguez",
        role: "Head of Growth",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
        bio: "Marketing strategist focused on helping companies attract and retain the best talent in their industry."
    },
    {
        name: "Emily Foster",
        role: "Head of Design",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        bio: "UX/UI designer dedicated to creating intuitive experiences that make job searching enjoyable and effective."
    }
];

export default function TeamSection() {
    return (
        <section className="py-20 lg:py-32 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        The passionate individuals behind Horizon Jobs who are committed to transforming how people find meaningful work.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="group">
                            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-start gap-6">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-indigo-600 font-medium mb-3">
                                            {member.role}
                                        </p>
                                        <p className="text-gray-600 leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
