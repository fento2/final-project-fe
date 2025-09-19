"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import FormPreselectionTest from "./components/FormPreSelection";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { usePreselectionStore } from "@/lib/zustand/preselectionStore";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailPosting from "./components/DetailJobPosting";
import ApplicantSection from "./components/ApplicantsSection";
import DetailApplicationPage from "./components/DetailApplication";

const DetailPostings = () => {
  const params = useParams();
  const { slug } = params;
  const { showForm, setShowForm } = usePreselectionStore()
  const router = useRouter()
  const {
    questions,
    setQuestions,
    minScore,
    setMinScore,
  } = usePreselectionStore();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // | Question       | OptionA | OptionB | OptionC | OptionD | Answer |
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const parsedQuestions = (jsonData as any[]).map((row) => ({
        question: row["Question"] || "",
        options: [
          row["Option A"] || "",
          row["Option B"] || "",
          row["Option C"] || "",
          row["Option D"] || "",
        ].filter(Boolean),
        answer: row["Answer"],
      })).slice(0, 25)

      setQuestions(parsedQuestions);
      e.target.value = ''

    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="space-y-6 container mx-auto md:px-20 px-8 my-8">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <DetailPosting />
        {/* preselectiontest */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => { setShowForm(false), router.replace(`/dashboard/postings/${slug}`) }}
          >
            <Card
              className=" w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-6xl mx-4 relative max-h-[600px] overflow-y-auto sm:max-h-[700px] md:max-h-[800px] lg:max-h-none lg:overflow-visible scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="absolute left-6 top-7 text-black text-xl font-bold"
                >Maximal 25 question</p>
                {/* Tombol close X */}
                <button
                  onClick={() => { setShowForm(false), router.replace(`/dashboard/postings/${slug}`) }}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                  <X />
                </button>
              </div>

              <CardContent className="space-y-4 p-4 sm:p-6">
                {/* Form Preselection + upload file */}
                <FormPreselectionTest
                  questions={questions}
                  setQuestions={setQuestions}
                  minScore={minScore}
                  setMinScore={setMinScore} />

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Upload the test questions in Excel format (.xlsx or .xls) or enter
                    them manually below.
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    className="w-full sm:w-64 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

        )}


        <div className="lg:col-span-1 order-3 lg:order-2 sticky top-25">
          <ApplicantSection />
        </div>
      </div>
      <DetailApplicationPage />
    </div >
  );
};

export default DetailPostings;
