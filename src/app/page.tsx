
import HeroSection from "./components/HeroSection";

import FeatureJobSection from "./components/FeatureJob";
import TopCompaniesSection from "./components/TopCompaniesSection";


export default function Home() {
  return (
    <>
      <div>

      <HeroSection />

        <h1 className="text-3xl">Testing</h1>
        <FeatureJobSection />
        <TopCompaniesSection />

      </div>

    </>
  );
}
