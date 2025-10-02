import React from "react";

interface HeroContentProps {
    isCompanyUser: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({ isCompanyUser }) => {
    return (
        <>
            <span className="block text-center text-base font-semibold text-[#4F46E5] mb-6">
                The Only Job Marketplace
            </span>
            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#18181B] mb-4 leading-tight">
                {isCompanyUser ? (
                    <>Find the best employees<br />with us</>
                ) : (
                    <>Find Your Dream<br />Job with Us</>
                )}
            </h1>
            <p className="text-center text-base sm:text-lg text-[#52525B] mb-8 max-w-2xl px-2">
                {isCompanyUser 
                    ? "Connect with top talent and build your dream team with Horizon Jobs, the premier recruitment platform for employers."
                    : "Discover your next career move with Horizon Jobs, the go-to job marketplace for job seekers and employers."
                }
            </p>
        </>
    );
};