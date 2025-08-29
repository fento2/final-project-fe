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
            testimonial: "I was struggling to find a job that fit my skills and experience, but Horizon Jobs changed everything. I found my dream job in my field in just a few weeks, and the application process was quick and straightforward."
        },
        {
            id: 2,
            name: "Michael Lawson",
            location: "Seattle, WA",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0",
            testimonial: "Highly recommend Horizon Jobs to anyone looking for a job. The site is user-friendly and the job listings are always up-to-date. I found my dream job thanks to Horizon Jobs and I couldn't be happier."
        },
        {
            id: 3,
            name: "Emily Harold",
            location: "New York, NY",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0",
            testimonial: "As a recent graduate, I was struggling to find a job in my field. Horizon Jobs helped me navigate through the job search process. Their platform made it easy to apply and stay organized throughout the process. I recommend Horizon Jobs!"
        }
    ];
    const [currentIndex, setCurrentIndex] = useState(1); // Default to middle card (index 1)
    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };
    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                        Testimonial
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-2">
                        What people are saying about working with us
                    </p>
                </div>
                <div className="relative">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={prevTestimonial}
                            className="hidden md:block lg:hidden absolute left-0 z-10 p-2 lg:p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors -ml-4 lg:-ml-8"
                        >
                            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                        </button>
                        <div className="w-full overflow-hidden">
                            {/* Mobile View - Single Card Carousel */}
                            <div className="block lg:hidden">
                                <div className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                    {testimonials.map((testimonial, index) => (
                                        <div
                                            key={testimonial.id}
                                            className="w-full flex-shrink-0 px-2 sm:px-4 md:px-6"
                                        >
                                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center max-w-2xl mx-auto">
                                                <div className="mb-6">
                                                    <Image
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-full mx-auto object-cover w-16 h-16 sm:w-20 sm:h-20"
                                                    />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                                    {testimonial.name}
                                                </h3>
                                                <div className="flex items-center justify-center mb-4 text-gray-500">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">{testimonial.location}</span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-xl mx-auto">
                                                    "{testimonial.testimonial}"
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Desktop View - 3 Cards with Navigation */}
                            <div className="hidden lg:block">
                                <div className="flex items-center justify-center gap-8 max-w-7xl mx-auto">
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={prevTestimonial}
                                            className="w-16 h-16 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:bg-gray-50 group"
                                        >
                                            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 max-w-7xl w-full">
                                        {testimonials.map((testimonial, index) => {
                                            const isActive = index === currentIndex;
                                            const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                                            const isNext = index === (currentIndex + 1) % testimonials.length;
                                            let opacity = "opacity-40";
                                            let scale = "scale-90";
                                            if (isActive) {
                                                opacity = "opacity-100";
                                                scale = "scale-100";
                                            } else if (isPrev || isNext) {
                                                opacity = "opacity-70";
                                                scale = "scale-95";
                                            }
                                            return (
                                                <div
                                                    key={testimonial.id}
                                                    className={`${opacity} ${scale} transition-all duration-300 cursor-pointer`}
                                                    onClick={() => setCurrentIndex(index)}
                                                >
                                                    <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg text-center h-full min-h-[400px]">
                                                        <div className="mb-6">
                                                            <Image
                                                                src={testimonial.image}
                                                                alt={testimonial.name}
                                                                width={80}
                                                                height={80}
                                                                className="rounded-full mx-auto object-cover w-20 h-20 lg:w-24 lg:h-24"
                                                            />
                                                        </div>
                                                        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                                                            {testimonial.name}
                                                        </h3>
                                                        <div className="flex items-center justify-center mb-6 text-gray-500">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            <span className="text-sm lg:text-base">{testimonial.location}</span>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                                            "{testimonial.testimonial}"
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={nextTestimonial}
                                            className="w-16 h-16 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:bg-gray-50 group"
                                        >
                                            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={nextTestimonial}
                            className="hidden md:block lg:hidden absolute right-0 z-10 p-2 lg:p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors -mr-4 lg:-mr-8"
                        >
                            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                        </button>
                    </div>
                    <div className="flex justify-center space-x-4 mt-6 md:hidden">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-6 md:mt-8 space-x-2 lg:hidden">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentIndex ? "bg-indigo-500" : "bg-gray-300"
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
