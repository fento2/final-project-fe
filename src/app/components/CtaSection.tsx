"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/zustand/AuthUIASrore";

const CtaSection: React.FC = () => {
  const { setShowSignUp } = useAuthStore();
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Handshake Image - Full width at top */}
          <div className="relative w-full h-80 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0"
              alt="Business handshake partnership"
              width={1200}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="px-8 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Join Horizon Jobs today and take the
                <br className="hidden lg:block" />
                first step towards finding your dream job!
              </h2>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
                With our user-friendly platform and up-to-date job listings,
                you'll be on your way to a fulfilling
                <br className="hidden lg:block" />
                career in no time. Sign up now and see what opportunities await!
              </p>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  setShowSignUp(true);
                }}
                className="inline-flex items-center justify-center px-10 py-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
