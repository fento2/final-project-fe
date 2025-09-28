"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import General from "./components/General";
import Security from "../components/Security";
import { useAuthRole } from "@/helper/useAuthRole";


const ProfileCompany = () => {
  useAuthRole('COMPANY')
  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black tracking-wider">
          Company Data
        </h3>
        <span className="text-sm text-gray-600">Fill in your company data</span>
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* Tabs List */}
        <TabsList className=" w-full">
          <TabsTrigger value="general" className="">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="">
            Security
          </TabsTrigger>
        </TabsList>

        {/* General → Personal Data */}
        <TabsContent value="general" className="">
          <General />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="">
          <Security />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileCompany;
