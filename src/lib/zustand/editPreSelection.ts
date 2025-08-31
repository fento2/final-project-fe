import { create } from "zustand";

interface IQuestions {
  question: string;
  options: string[]; // [A, B, C, D]
  answer: string; // jawaban benar: "A" | "B" | "C" | "D"
}

type PreselectionTest = {
  questions: IQuestions[];
  setQuestions: (questions: IQuestions[]) => void;
  addQuestion: (question: IQuestions) => void;
  updateQuestion: (index: number, question: IQuestions) => void;
  resetQuestions: () => void;
};

export const useEditPreselectionStore = create<PreselectionTest>()((set) => ({
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
}));
