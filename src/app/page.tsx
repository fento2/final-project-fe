import HeroSection from "./components/HeroSection";
import DiscoverySection from "./components/DiscoverySection";
import FeatureJobSection from "./components/FeatureJob";
import TopCompaniesSection from "./components/TopCompaniesSection";
import JobCategories from "./components/JobCategories";

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
      </section>

    </>
  );
}
