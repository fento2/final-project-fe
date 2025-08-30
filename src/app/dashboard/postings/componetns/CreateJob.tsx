"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormJobPosting from "./FormJobPosting";
import { useCreateJob } from "@/lib/zustand/createJobStore";
import { Briefcase } from "lucide-react";
import PreselectionTest from "./CreatePreSelection";
import { Separator } from "@/components/ui/separator";

const CreateJob = () => {
  const { preSelection } = useCreateJob();

  const handleSave = () => {
    console.log("Updated Profile:");
    // TODO: call API update profile di sini
  };

  return (
    <div className="mx-auto min-h-screen py-6">
      {/* Card */}
      <Card className="">
        <CardHeader className="text-2xl font-bold tracking-widest text-indigo-600">
          Job Informations
          <p className="text-sm font-normal text-gray-500 mt-1">
            Basic Job info visible to candidates
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormJobPosting />
          <Separator className="w-full h-[0.5px]" />
          {preSelection && <PreselectionTest />}

          {/* Actions */}
          <div className="">
            <Button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-700">
              Post <Briefcase />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
