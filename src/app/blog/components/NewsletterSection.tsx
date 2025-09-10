"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            // Here you would typically handle the newsletter subscription
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
    <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-indigo-50 rounded-3xl p-8 lg:p-12">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Stay Updated with Career Insights
                    </h2>
                    
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Get the latest career tips, industry trends, and job opportunities delivered straight to your inbox. Join over 10,000 professionals who trust our newsletter.
                    </p>

                    {isSubscribed ? (
                        <div className="bg-green-100 text-green-800 py-4 px-6 rounded-xl font-semibold">
                            🎉 Thank you for subscribing! Check your email for confirmation.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-sm text-gray-500 mt-4">
                        No spam, unsubscribe at any time. We respect your privacy.
                    </p>
                </div>
            </div>
        </section>
    );
}
