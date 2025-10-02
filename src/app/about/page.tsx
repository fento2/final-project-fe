import HeroSection from "./components/HeroSection";
import MissionSection from "./components/MissionSection";
import ValuesSection from "./components/ValuesSection";
import TeamSection from "./components/TeamSection";
import TimelineSection from "./components/TimelineSection";
import StorySection from "./components/StorySection";
import CTASection from "./components/CTASection";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <MissionSection />
            <ValuesSection />
            <TeamSection />
            <TimelineSection />
            <StorySection />
            <CTASection />
        </div>
    );
}
