import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import FeaturedArticles from "./components/FeaturedArticles";
import RecentArticles from "./components/RecentArticles";
import BlogSidebar from "./components/BlogSidebar";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <HeroSection />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <CategoryFilter />
                        <FeaturedArticles />
                        <RecentArticles />
                    </div>
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
