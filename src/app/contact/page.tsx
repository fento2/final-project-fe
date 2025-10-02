"use client";
import React, { useState } from "react";
import Image from "next/image";
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';
import OfficeLocations from './components/OfficeLocations';
import CTA from './components/CTA';

export default function ContactPage() {
    const [selected, setSelected] = useState<number>(1); // default to middle card
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background image for header area */}
            <div className="absolute top-0 right-0 w-full h-96 overflow-hidden">
                <Image 
                    src="/images/header_bg.png" 
                    alt="Header Background" 
                    width={1920}
                    height={400}
                    className="object-cover w-full h-full opacity-60"
                    priority
                />
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-30 z-10">
                <div className="absolute top-8 right-12 w-4 h-4 bg-white/50 rounded-full"></div>
                <div className="absolute top-16 right-32 w-6 h-6 bg-white/30 rounded-full"></div>
                <div className="absolute top-24 right-8 w-3 h-3 bg-white/60 rounded-full"></div>
                <div className="absolute top-32 right-24 w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
            
            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-8 pt-16 relative z-20">
                {/* Breadcrumb */}
                <nav className="mb-12">
                    <div className="flex items-center gap-3 text-lg">
                        <span className="text-indigo-500 font-medium cursor-pointer hover:underline">Home</span>
                        <span className="text-indigo-500 font-light">/</span>
                        <span className="text-indigo-600 font-bold">Contact</span>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>

            {/* Our Office Locations */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Office Locations</h2>
                    
                    <OfficeLocations selected={selected} setSelected={setSelected} />
                </div>
            </div>

            {/* Call to Action */}
            <CTA />

        </div>
    );
}