"use client";
import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I was struggling to find a job that fit my skills and experience, but Horizon Jobs made it easy. I found a job in just two weeks! I really appreciate the quick application process, which was quick and straightforward.",
    name: "Susan Mitchell",
    location: "Austin, TX",
    avatar: "/images/logo.png",
  },
  {
    quote:
      "I highly recommend Horizon Jobs to anyone looking for a job. It's the platform is user-friendly and the job listings are up-to-date. The process is smooth from start to finish. Thanks to Horizon Jobs and I couldn't be happier!",
    name: "Michael Lawson",
    location: "Seattle, WA",
    avatar: "/images/logo.png",
  },
  {
    quote:
      "As a recent graduate, I was struggling to find a job in my field. Horizon Jobs helped me find the right job and the platform made it easy to apply. The process was quick and straightforward. I highly recommend Horizon Jobs!",
    name: "Emily Jarold",
    location: "New York, NY",
    avatar: "/images/logo.png",
  },
];

const BrowseTestimonialSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Testimonial</h2>
          <p className="text-gray-500 mt-1 text-sm">What people are saying about working with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white"
            >
              <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 grid place-items-center mb-3">
                <Quote className="w-4 h-4" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.quote}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pager mimic */}
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            aria-label="Previous"
            className="w-8 h-8 grid place-items-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            {["01", "02", "03", "04", "05"].map((n, i) => (
              <span
                key={n}
                className={
                  i === 1
                    ? "px-3 py-1 rounded-md bg-indigo-600 text-white font-medium"
                    : "text-gray-500"
                }
              >
                {n}
              </span>
            ))}
          </div>
          <button
            aria-label="Next"
            className="w-8 h-8 grid place-items-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseTestimonialSection;
