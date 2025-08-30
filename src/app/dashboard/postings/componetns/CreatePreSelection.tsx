"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

type Question = {
  question: string;
  options: string[]; // [A, B, C, D]
  answer?: string; // jawaban benar: "A" | "B" | "C" | "D"
};

const PreselectionTest = () => {
  const [questions, setQuestions] = useState<Question[]>(
    Array.from({ length: 2 }, () => ({
      question: "",
      options: ["", "", "", ""],
      answer: "",
    }))
  );

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex: number, selected: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answer = selected;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    console.log("Preselection Questions:", questions);
    // simpan ke backend
  };

  return (
    <div className="mx-auto min-h-screen py-6">
      <Card>
        <CardHeader className="text-2xl font-bold tracking-widest text-indigo-600">
          Preselection Test
          <p className="text-sm font-normal text-gray-500 mt-1">
            Assess candidates’ skills before interview
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="space-y-2">
              <Label className="ml-2 text-lg">Question {i + 1}</Label>
              <Input
                value={q.question}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
                placeholder={`Enter question ${i + 1}`}
                className="py-6 !text-lg"
              />

              <div className="grid grid-cols-2 gap-2 mt-1">
                {["A", "B", "C", "D"].map((opt, idx) => (
                  <div>
                    <Label className="ml-2 text-lg">{opt}</Label>
                    <Input
                      key={idx}
                      value={q.options[idx]}
                      onChange={(e) =>
                        handleOptionChange(i, idx, e.target.value)
                      }
                      placeholder={`Option ${opt}`}
                      className="py-6 !text-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <Label className="ml-2 text-lg">Correct Options</Label>
                <Select
                  value={q.answer}
                  onValueChange={(val) => handleAnswerChange(i, val)}
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
            </div>
          ))}

          <Button onClick={handleSubmit} className="mt-4">
            Save Questions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreselectionTest;
