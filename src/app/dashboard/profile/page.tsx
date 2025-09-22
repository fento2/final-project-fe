"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import General from "./components/General";
import Security from "../components/Security";
import CardEducation from "./components/CardEducation";
import ExperienceCard from "./components/CardExperience";
import EducationForm from "./components/EducationForm";
import ExperienceForm from "./components/ExperienceForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";
import { useAuthRole } from "@/helper/authRole";
import ProfileCvGeneratorSection from "./sections/ProfileCvGeneratorSection";
import ProfileSkillsSection from "./sections/ProfileSkillsSection";

const ProfileUser = () => {
  useAuthRole('USER')
  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black tracking-wider">
          Profile Settings
        </h3>
        <span className="text-sm text-gray-600">
          Manage your personal data, education, experience, and account security.
        </span>
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* Tabs List */}
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="cvgenerator">CV Generator</TabsTrigger>
        </TabsList>

        {/* General → Personal Data, Education, Experience */}
        <TabsContent value="general" className="">
          {/* Personal Data */}
          <section>
            <h3 className="text-xl font-semibold text-black">Personal Data</h3>
            <span className="text-sm text-gray-600">
              Fill in the data according to your ID card.
            </span>
            <div className="mt-4">
              <General />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education */}
            <div>
              <Card className="mt-4 space-y-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-500 flex items-center gap-2"><GraduationCap />Education</h3>
                      <span className="text-sm text-gray-600">
                        Add your academic background and qualifications.
                      </span>
                    </div>
                    <EducationForm />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[600px]">
                  <CardEducation />
                </CardContent>
              </Card>
            </div>

            {/* Experience */}
            <div>
              <Card className="mt-4 space-y-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-500 flex items-center gap-2"><Briefcase /> Experience</h3>
                      <span className="text-sm text-gray-600">
                        Add your work history and achievements.
                      </span>
                    </div>
                    <ExperienceForm />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[600px]">
                  <ExperienceCard />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <ProfileSkillsSection />
              </Card>
            </div>
          </section>

        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Security />
        </TabsContent>

        <TabsContent value="cvgenerator">
          <ProfileCvGeneratorSection />
        </TabsContent>
      </Tabs>
    </div >
  );
};

export default ProfileUser;
