"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

export default function ContactForm() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Leave Us A Message</h2>
                <p className="text-gray-600">You can ask us anything with the message. We will get back to you soon!</p>
            </div>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Your Name</label>
                        <input id="name" placeholder="Enter your name ..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Your Email</label>
                        <input id="email" placeholder="Enter your email address ..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                    </div>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">Your Message</label>
                    <textarea id="message" rows={5} placeholder="Enter your message ..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none" />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">Submit</Button>
                </div>
            </form>
        </div>
    );
}
