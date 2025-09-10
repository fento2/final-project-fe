"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormJobPosting from "./FormJobPosting";
import { Briefcase, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCreateJobStore } from "@/lib/zustand/createJobStore";
import { postingsCreateFetch, updateJobPostingFetch } from "@/fetch/postings.fetch";
import { useToast } from "@/components/basic-toast";
import { useGeneralDataStore } from "@/lib/zustand/generalData";
import { Dots_v2 } from "@/components/ui/spinner";
import { useState } from "react";
import { useEditJobStore } from "@/lib/zustand/editJobStore";

const CardJobPosting = () => {
  const pathname = usePathname();
  const isEdit = pathname.includes("edit");
  const toast = useToast()
  const router = useRouter()
  const { reset } = useCreateJobStore()
  const { reset: resetGeneralData } = useGeneralDataStore()
  const [loading, setLoading] = useState(false)
  const { slug } = useParams()



  const handleSave = async () => {
    const res = await postingsCreateFetch(useCreateJobStore.getState(), toast, setLoading)
    if (res) {
      router.push('/dashboard/postings')
      reset()
      resetGeneralData()
    }
  };

  const handleUpdate = async () => {
    const res = await updateJobPostingFetch(useEditJobStore, toast, setLoading, slug as string)
    if (res) {
      router.push('/dashboard/postings')
      reset()
      resetGeneralData()
    }
  }

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

            <Button
              className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-700"
              onClick={() => isEdit ? handleUpdate() : handleSave()}
            >
              {loading ? (
                <Dots_v2 />
              ) : (
                <>
                  {isEdit ? "Update" : "Post"} <Briefcase />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardJobPosting;
