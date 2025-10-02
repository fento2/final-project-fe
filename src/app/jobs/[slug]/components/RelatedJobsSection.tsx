"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SimilarJobCard from "./SimilarJobCard";

interface RelatedJobsSectionProps {
  relatedJobs: any[];
  displayJobId: string | number;
  loading: boolean;
}

const RelatedJobsSection: React.FC<RelatedJobsSectionProps> = ({ relatedJobs, displayJobId, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter and limit related jobs
  const filteredJobs = relatedJobs
    .filter((job: any) => job.job_id !== displayJobId)
    .slice(0, 6);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev >= filteredJobs.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? filteredJobs.length - 1 : prev - 1
    );
  };

  // Reset current index when jobs change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredJobs.length]);

  return (
    <section className="mt-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Related Jobs</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover more opportunities that match your interests and skills
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No related jobs found</p>
        </div>
      ) : (
        <>
          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job: any) => (
              <SimilarJobCard key={job.job_id} job={job} />
            ))}
          </div>

          {/* Mobile Carousel View */}
          <div className="md:hidden">
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {filteredJobs.map((job: any) => (
                    <div key={job.job_id} className="w-full flex-shrink-0 px-2">
                      <SimilarJobCard job={job} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {filteredJobs.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                    aria-label="Previous job"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                    aria-label="Next job"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {filteredJobs.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {filteredJobs.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? 'bg-indigo-600 w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default RelatedJobsSection;
