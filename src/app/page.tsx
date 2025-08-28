
import HeroSection from "./components/HeroSection";
import DiscoverySection from "./components/DiscoverySection";
import FeatureJobSection from "./components/FeatureJob";
import TopCompaniesSection from "./components/TopCompaniesSection";


export default function Home() {
  return (
    <>
      <div>

        <HeroSection />
        <FeatureJobSection />
        <TopCompaniesSection />
        <DiscoverySection />
      </div>

    </>
  );
}
