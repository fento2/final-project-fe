"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigasiSoal from "./NavigasiSoal";
import HeaderPreselectionTestForm from "./HeaderPreselectionForm";
import FormPertanyaan from "./FormPertanyaan";

const MAX_QUESTIONS = 25;

type Question = {
  question: string;
  options: string[];
  answer: string;
};

interface FormPreselectionTestProps {
  questions: Question[];
  minScore: number;
  setQuestions: (q: Question[]) => void;
  setMinScore: (val: number) => void;
}

const FormPreselectionTest = ({
  questions,
  minScore,
  setQuestions,
  setMinScore,
}: FormPreselectionTestProps) => {
  // State navigasi soal
  const [currentIndex, setCurrentIndex] = useState(0);

  // Inisialisasi soal pertama
  useEffect(() => {
    if (questions.length === 0) {
      const initial = [{ question: "", options: ["", "", "", ""], answer: "" }];
      setQuestions(initial);
    }
  }, [questions.length, setQuestions]);

  /** Navigasi soal */
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));

  /** Update isi soal */
  const handleQuestionChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], question: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], answer: value };
    setQuestions(updated);
  };

  /** Tambah / hapus soal */
  const handleAddQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return;
    const newQ = { question: "", options: ["", "", "", ""], answer: "" };
    setQuestions([...questions, newQ]);
    setCurrentIndex(questions.length); // langsung ke soal baru
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);

    if (index >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    } else {
      setCurrentIndex(Math.max(0, index));
    }
  };

  return (
    <div className="mt-4">
      {/* Header */}
      <HeaderPreselectionTestForm
        handleAddQuestion={handleAddQuestion}
        questions={questions}
        currentIndex={currentIndex}
        MAX_QUESTIONS={MAX_QUESTIONS}
        handleDeleteQuestion={handleDeleteQuestion}
      />

      {/* Input Passing Score */}
      <div className="mb-4">
        <Label className="ml-2 text-lg">Passing Score</Label>
        <Input
          type="number"
          min={0}
          max={100}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          placeholder="Enter passing score, e.g. 70"
          className="py-6 !text-lg"
        />
        <p className="text-xs text-muted-foreground ml-2">
          Minimum score required to continue the application
        </p>
      </div>

      {/* Form pertanyaan */}
      {questions.length > 0 && (
        <div className="space-y-2 border-b pb-4">
          <FormPertanyaan
            currentIndex={currentIndex}
            questions={questions}
            handleOptionChange={handleOptionChange}
            handleQuestionChange={handleQuestionChange}
          />

          {/* Pilih jawaban benar */}
          <div className="mt-2">
            <Label className="ml-2 text-lg">Correct Option</Label>
            <Select
              value={questions[currentIndex].answer}
              onValueChange={(val) => handleAnswerChange(currentIndex, val)}
            >
              <SelectTrigger className="py-6 !text-lg">
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C", "D"].map((opt) => (
                  <SelectItem key={opt} value={opt} className="p-4 text-lg">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Navigasi soal */}
          <NavigasiSoal
            handleNext={handleNext}
            handlePrev={handlePrev}
            currentIndex={currentIndex}
            questions={questions}
          />
        </div>
      )}
    </div>
  );
};

export default FormPreselectionTest;
