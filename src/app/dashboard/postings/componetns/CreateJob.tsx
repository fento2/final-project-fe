"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormJobPosting from "./FormJobPosting";
import { useCreateJob } from "@/lib/zustand/CreateJobStore";
import { Briefcase, ChevronRight } from "lucide-react";

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

        <CardContent className="space-y-6">
          <FormJobPosting />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {preSelection ? (
              <Button
                variant={"ghost"}
                className="w-full sm:w-auto border-2 border-indigo-700 text-indigo-700"
              >
                Next <ChevronRight />
              </Button>
            ) : (
              <Button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-700">
                Post <Briefcase />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
