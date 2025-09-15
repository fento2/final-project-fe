import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative py-16 lg:py-24 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/images/header_bg.png')`,
                    }}
                ></div>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/80"></div>
            </div>

            {/* Background Geometric Pattern */}
            <div className="absolute inset-0">
                {/* Abstract geometric shapes similar to the image */}


                {/* Abstract lines */}
                <div className="absolute top-20 right-20 w-64 h-64 opacity-15">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M10,10 Q50,5 90,20 Q95,50 80,90 Q50,95 10,80 Q5,50 10,10"
                            stroke="#9CA3AF" strokeWidth="0.5" fill="none" />
                        <path d="M20,20 Q50,15 80,30 Q85,50 70,80 Q50,85 20,70 Q15,50 20,20"
                            stroke="#D1D5DB" strokeWidth="0.3" fill="none" />
                    </svg>
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-blue-600 font-medium">Blog</span>
                </nav>

                {/* Hero Content */}
                <div className="max-w-4xl">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Insights & Inspiration:
                        <br />
                        <span className="text-blue-600">The JobLinkup Blog</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
                        Discover career insights, job market trends, and expert advice to help you
                        navigate your professional journey and accelerate your career growth.
                    </p>
                </div>
            </div>
        </section>
    );
}
