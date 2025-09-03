"use client";
import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function ContactInfo() {
    return (
        <div className="space-y-16 mt-8">
            <div>
                <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                    Get in Touch<br />
                    with Us
                </h1>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mt-1">
                            <Phone className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 mb-1">Phone</div>
                            <div className="text-gray-600">123-456-7890</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mt-1">
                            <Mail className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 mb-1">Email</div>
                            <div className="text-gray-600">support@joblinkup.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
