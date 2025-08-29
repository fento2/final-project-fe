"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    location: string;
    image: string;
    testimonial: string;
}

const TestimonialSection: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Susan Mitchell",
            location: "Austin, TX",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0",
            testimonial: "I was struggling to find a job that fit my skills and experience, but JobLinkup changed everything. I found my dream job in my field in just a few weeks, and the application process was quick and straightforward."
        },
        {
            id: 2,
            name: "Michael Lawson",
            location: "Seattle, WA",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0",
            testimonial: "Highly recommend JobLinkup to anyone looking for a job. The site is user-friendly and the job listings are always up-to-date. I found my dream job thanks to JobLinkup and I couldn't be happier."
        },
        {
            id: 3,
            name: "Emily Harold",
            location: "New York, NY",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0",
            testimonial: "As a recent graduate, I was struggling to find a job in my field. JobLinkup helped me navigate through the job search process. Their platform made it easy to apply and stay organized throughout the process. I recommend JobLinkup!"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Testimonial
                    </h2>
                    <p className="text-gray-600 text-lg">
                        What people are saying about working with us
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className="relative">
                    <div className="flex items-center justify-center">
                        {/* Previous Button */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>

                        {/* Testimonials */}
                        <div className="flex space-x-8 overflow-hidden max-w-6xl">
                            {testimonials.map((testimonial, index) => {
                                const isActive = index === currentIndex;
                                const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                                const isNext = index === (currentIndex + 1) % testimonials.length;
                                
                                let visibility = "hidden";
                                let opacity = "opacity-0";
                                let scale = "scale-75";
                                
                                if (isActive) {
                                    visibility = "block";
                                    opacity = "opacity-100";
                                    scale = "scale-100";
                                } else if (isPrev || isNext) {
                                    visibility = "block";
                                    opacity = "opacity-50";
                                    scale = "scale-90";
                                }

                                return (
                                    <div
                                        key={testimonial.id}
                                        className={`${visibility} ${opacity} ${scale} transition-all duration-300 flex-shrink-0 w-80`}
                                    >
                                        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                                            <div className="mb-6">
                                                <Image
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-full mx-auto object-cover"
                                                />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {testimonial.name}
                                            </h3>
                                            <div className="flex items-center justify-center mb-4 text-gray-500">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span className="text-sm">{testimonial.location}</span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                "{testimonial.testimonial}"
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextTestimonial}
                            className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentIndex ? "bg-indigo-500" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
