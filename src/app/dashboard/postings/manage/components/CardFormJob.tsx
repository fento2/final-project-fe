"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormJobPosting from "./FormJobPosting";
import { Briefcase, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useCreateJobStore } from "@/lib/zustand/createJobStore";

const CardJobPosting = () => {
  const pathname = usePathname();
  const isEdit = pathname.includes("edit");
  const { reset } = useCreateJobStore();

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

          {/* Actions */}
          <div className={`flex ${isEdit ? "justify-end" : "justify-between"}`}>
            {!isEdit && (
              <Button
                className="w-full sm:w-auto bg-neutral-300 text-black hover:bg-neutral-700 hover:text-white"
                onClick={reset}
              >
                Reset <RotateCcw />
              </Button>
            )}
            <Button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-700">
              {isEdit ? "Update" : "Post"} <Briefcase />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardJobPosting;
