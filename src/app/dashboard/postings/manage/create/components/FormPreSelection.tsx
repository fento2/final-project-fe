"use client";
import { CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreatePreselectionStore } from "@/lib/zustand/createPreselectionStore";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useEditPreselectionStore } from "@/lib/zustand/editPreSelection";
import { usePathname } from "next/navigation";

const FormPreselectionTest = () => {
  const { questions, setQuestions, updateQuestion } =
    useCreatePreselectionStore();
  const { editQuestions, setEditQuestions, updateEditQuestion } =
    useEditPreselectionStore();
  const pathname = usePathname();
  const isEdit = pathname.includes("edit");
  const pageQuestions = isEdit ? editQuestions : questions;
  const pageSetQuestions = isEdit ? setEditQuestions : setQuestions;
  const pageUpdateQuestions = isEdit ? updateEditQuestion : updateQuestion;
  const [currentCount, setCurrentCount] = useState(pageQuestions.length || 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const MAX_QUESTIONS = 25;

  // navigasi soal
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < pageQuestions.length - 1 ? prev + 1 : prev
    );
  };

  // inisialisasi soal awal jika kosong
  useEffect(() => {
    if (pageQuestions.length === 0) {
      const initialQuestions = Array.from({ length: currentCount }, () => ({
        question: "",
        options: ["", "", "", ""],
        answer: "",
      }));
      pageSetQuestions(initialQuestions);
    }
  }, []);

  const handleQuestionChange = (index: number, value: string) => {
    const q = { ...pageQuestions[index], question: value };
    pageUpdateQuestions(index, q);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const q = { ...pageQuestions[qIndex] };
    q.options[oIndex] = value;
    pageUpdateQuestions(qIndex, q);
  };

  const handleAnswerChange = (qIndex: number, selected: string) => {
    const q = { ...pageQuestions[qIndex], answer: selected };
    pageUpdateQuestions(qIndex, q);
  };

  const handleAddQuestion = () => {
    if (pageQuestions.length >= MAX_QUESTIONS) return;
    const newQuestions = [
      ...pageQuestions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ];
    pageSetQuestions(newQuestions);
    setCurrentCount(newQuestions.length);
  };

  const handleSubmit = () => {
    console.log("Preselection Questions:", pageQuestions);
  };

  return (
    <div className="mt-4">
      <CardHeader className="-mx-6 text-2xl font-bold tracking-widest text-indigo-600">
        <div className="flex justify-between items-center">
          <div>
            <h1>Preselection Test</h1>
            <p className="text-sm font-normal text-gray-500 mt-1">
              Assess candidates’ skills before interview
            </p>
          </div>
          <div className="md:flex-row flex flex-col-reverse gap-2">
            <Button
              onClick={() => {
                const newQuestions = [...pageQuestions];
                newQuestions.splice(currentIndex, 1); // hapus soal
                pageSetQuestions(newQuestions);

                // update currentIndex
                if (
                  currentIndex >= newQuestions.length &&
                  newQuestions.length > 0
                ) {
                  setCurrentIndex(newQuestions.length - 1);
                } else if (newQuestions.length === 0) {
                  setCurrentIndex(0);
                }
              }}
              variant="destructive"
              className="flex items-center gap-2 md:text-sm text-xs"
            >
              Delete <Trash2 size={6} />
            </Button>

            <Button
              onClick={handleAddQuestion}
              disabled={pageQuestions.length >= MAX_QUESTIONS}
              className="flex items-center gap-2 md:text-sm text-xs"
            >
              Add <Plus size={6} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {pageQuestions.length > 0 && (
        <div className="space-y-2 border-b pb-4">
          <Label className="ml-2 text-lg">
            Question {currentIndex + 1} of {pageQuestions.length}
          </Label>
          <Input
            value={pageQuestions[currentIndex].question}
            onChange={(e) => handleQuestionChange(currentIndex, e.target.value)}
            placeholder={`Enter question ${currentIndex + 1}`}
            className="py-6 !text-lg"
          />
          {/* opsi dan select answer sama seperti sebelumnya, tapi pakai currentIndex */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {["A", "B", "C", "D"].map((opt, idx) => (
              <div key={idx}>
                <Label className="ml-2 text-lg">{opt}</Label>
                <Input
                  value={pageQuestions[currentIndex].options[idx]}
                  onChange={(e) =>
                    handleOptionChange(currentIndex, idx, e.target.value)
                  }
                  placeholder={`Option ${opt}`}
                  className="py-6 !text-lg"
                />
              </div>
            ))}
          </div>

          <div className="mt-2">
            <Label className="ml-2 text-lg">Correct Option</Label>
            <Select
              value={pageQuestions[currentIndex].answer}
              onValueChange={(val) => handleAnswerChange(currentIndex, val)}
            >
              <SelectTrigger className="py-6 !text-lg">
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C", "D"].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between mt-4">
            <Button onClick={handlePrev} disabled={currentIndex === 0}>
              Prev
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPreselectionTest;
