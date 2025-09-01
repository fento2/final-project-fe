import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IQuestion {
  question: string;
  options: string[]; // [A, B, C, D]
  answer: string; // jawaban benar: "A" | "B" | "C" | "D"
}

type PreselectionTest = {
  questions: IQuestion[];
  setQuestions: (questions: IQuestion[]) => void;
  addQuestion: (question: IQuestion) => void;
  updateQuestion: (index: number, question: IQuestion) => void;
  resetQuestions: () => void;
};

export const useCreatePreselectionStore = create<PreselectionTest>()(
  persist(
    (set) => ({
      questions: [],
      setQuestions: (questions) => set({ questions }),
      addQuestion: (question) =>
        set((state) => ({ questions: [...state.questions, question] })),
      updateQuestion: (index, question) =>
        set((state) => {
          const newQuestions = [...state.questions];
          newQuestions[index] = question;
          return { questions: newQuestions };
        }),
      resetQuestions: () => set({ questions: [] }),
    }),
    {
      name: "preselection-test-storage", // key di localStorage
    }
  )
);
