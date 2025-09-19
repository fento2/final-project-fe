"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const BrowseCTASection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold leading-snug">
                Join Horizon Jobs today and take the first step towards finding your dream job!
              </h2>
              <p className="mt-3 text-white/90 text-sm sm:text-base max-w-2xl">
                With our user-friendly platform and up-to-date job listings, you'll be on your way to a fulfilling career in no time. Sign up now and see what opportunities await!
              </p>
            </div>
            <div className="md:justify-self-end">
              <Button className="bg-white text-indigo-700 hover:bg-gray-100 font-medium rounded-lg h-11 px-6 shadow-sm">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseCTASection;
