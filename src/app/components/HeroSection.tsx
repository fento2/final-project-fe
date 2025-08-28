import React from "react";

const HeroSection = () => {
  return (
    <section className="w-screen min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center bg-white -mt-6 md:-mt-12">
      <div className="relative max-w-[1200px] w-full flex flex-col items-center rounded-[32px] md:rounded-[48px] overflow-hidden shadow-lg bg-white md:scale-[1.15] min-h-[520px] md:min-h-[700px] lg:min-h-[700px]">
        {/* Background image */}
        <img
          src="/images/bg_hero.jpg"
          alt="hero background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Overlay for soft white effect*/}
        <div className="absolute inset-0 bg-white/20 z-10" />

        <div className="relative z-20 flex flex-col items-center w-full px-4 sm:px-6 py-8 sm:py-12">
          <span className="block text-center text-base font-semibold text-[#4F46E5] mb-6">
            The Only Job Marketplace
          </span>
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#18181B] mb-4 leading-tight">
            Find Your Dream
            <br />
            Job with Us
          </h1>
          <p className="text-center text-base sm:text-lg text-[#52525B] mb-8 max-w-2xl px-2">
            Discover your next career move with Horizon Jobs, the go-to job
            marketplace for job seekers and employers.
          </p>
          <form className="flex flex-col md:flex-row items-center w-full max-w-3xl gap-3 sm:gap-4 mb-6 px-2">
            <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-[400px] border border-gray-200">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="What job are you looking for?"
                className="w-full outline-none bg-transparent text-sm sm:text-base"
              />
            </div>
            <div className="relative w-full md:w-[200px]">
              <select className="w-full bg-white border rounded-lg px-4 py-2 text-base outline-none appearance-none">
                <option>Select Category</option>
                <option>Graphic Designer</option>
                <option>UI/UX</option>
                <option>Web Developer</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-lg">
                ▼
              </span>
            </div>
            <button
              type="submit"
              className="bg-[#4F46E5] text-white font-semibold rounded-lg px-8 py-2 shadow hover:bg-[#4338CA] transition"
            >
              Search
            </button>
          </form>
          <div className="text-center w-full">
            <span className="font-semibold text-base text-[#18181B]">
              Popular Search:
            </span>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <span className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer">
                Graphic Designer
              </span>
              <span className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer">
                UI/UX
              </span>
              <span className="px-4 py-1 rounded-lg border text-[#4F46E5] bg-white shadow text-sm cursor-pointer">
                Web Developer
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
