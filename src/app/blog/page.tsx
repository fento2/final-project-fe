import HeroSection from "./components/HeroSection";
import BlogGrid from "./components/BlogGrid";
import NewsletterSection from "./components/NewsletterSection";

export default function BlogPage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <BlogGrid />
            <NewsletterSection />
        </div>
    );
}
