import HeroSection from "./components/HeroSection";
import DiscoverySection from "./components/DiscoverySection";
import FeatureJobSection from "./components/FeatureJob";
import TopCompaniesSection from "./components/TopCompaniesSection";
import JobCategories from "./components/JobCategories";
import AboutUsSection from "./components/AboutUsSection";
import TestimonialSection from "./components/TestimonialSection";
import CtaSection from "./components/CtaSection";
import BlogNewsSection from "./components/BlogNewsSection";
import FAQSection from "./components/FAQSection";

export default function Home() {
  return (
    <>

      <section>
        <div className="my-8 overflow-hidden">
          <HeroSection />
        </div>
        <div className="my-8">
          <JobCategories />
        </div>
        <div className="my-8">
          <FeatureJobSection />
        </div>
        <div className="my-8">
          <TopCompaniesSection />
        </div>
        <div className="my-8">
          <DiscoverySection />
        </div>
        <div className="my-8">
          <AboutUsSection />
        </div>
        <div>
          <TestimonialSection />
        </div>
        <div>
          <CtaSection />
        </div>
        <div>
          <BlogNewsSection />
        </div>
        <div>
          <FAQSection />
        </div>
      </section>

    </>
  );
}
