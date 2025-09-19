"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

export default function CTA() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="bg-indigo-900 rounded-2xl p-10 md:p-12 text-center shadow-xl">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                    Join Horizon Jobs today and take the first step towards finding your dream job!
                </h2>
                <p className="text-indigo-200 max-w-3xl mx-auto mb-8">
                    With our user-friendly platform and up-to-date job listings, you'll be on your way to a fulfilling career in no time. Sign up now and see what opportunities await!
                </p>

                <div className="flex justify-center">
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-md">Join Now</Button>
                </div>
            </div>
        </div>
    );
}
