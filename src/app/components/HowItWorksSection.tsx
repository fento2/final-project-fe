"use client";
import React from "react";
import { Search, FileText, User, PenTool, Send } from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorksSection: React.FC = () => {
  const steps: Step[] = [
    {
      number: "01",
      title: "Search",
      description: "Browse our comprehensive database to find jobs that match you",
      icon: <Search className="w-8 h-8 text-indigo-600" />
    },
    {
      number: "02", 
      title: "Review",
      description: "Read job descriptions and requirements",
      icon: <FileText className="w-8 h-8 text-indigo-600" />
    },
    {
      number: "03",
      title: "Create",
      description: "Build your profile on the website",
      icon: <User className="w-8 h-8 text-indigo-600" />
    },
    {
      number: "04",
      title: "Customize",
      description: "Prepare and polish your cover letter",
      icon: <PenTool className="w-8 h-8 text-indigo-600" />
    },
    {
      number: "05",
      title: "Apply",
      description: "Submit and follow the application process",
      icon: <Send className="w-8 h-8 text-indigo-600" />
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to find and apply for your dream job
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center group relative">
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors duration-200">
                <span className="text-2xl font-bold text-indigo-600">
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
