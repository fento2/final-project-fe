import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IQuestion {
  question: string;
  options: string[]; // [A, B, C, D]
  answer: string; // jawaban benar: "A" | "B" | "C" | "D"
}

type PreselectionTest = {
  questions: IQuestion[];
  minScore: number; // <-- tambahkan
  slug: string;
  showForm: boolean;
  setQuestions: (questions: IQuestion[]) => void;
  addQuestion: (question: IQuestion) => void;
  updateQuestion: (index: number, question: IQuestion) => void;
  setMinScore: (minScore: number) => void; // <-- setter
  setSlug: (slug: string) => void;
  setShowForm: (val: boolean) => void;
  resetQuestions: () => void;
};

export const usePreselectionStore = create<PreselectionTest>()((set) => ({
  questions: [],
  minScore: 70, // default passing score
  slug: "",
  showForm: false,
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  updateQuestion: (index, question) =>
    set((state) => {
      const newQuestions = [...state.questions];
      newQuestions[index] = question;
      return { questions: newQuestions };
    }),
  setMinScore: (minScore) => set({ minScore }), // setter
  setSlug: (slug) => set({ slug }),
  setShowForm: (showForm) => set({ showForm }),
  resetQuestions: () =>
    set({
      questions: [],
      minScore: 70,
      slug: "",
      showForm: false,
    }), // reset termasuk minScore
}));
