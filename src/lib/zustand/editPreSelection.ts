import { create } from "zustand";

interface IQuestion {
  question: string;
  options: string[]; // [A, B, C, D]
  answer: string; // jawaban benar: "A" | "B" | "C" | "D"
}

type EditPreselectionTest = {
  editQuestions: IQuestion[];
  setEditQuestions: (questions: IQuestion[]) => void;
  addEditQuestion: (question: IQuestion) => void;
  updateEditQuestion: (index: number, question: IQuestion) => void;
  resetEditQuestions: () => void;
};

export const useEditPreselectionStore = create<EditPreselectionTest>()(
  (set) => ({
    editQuestions: [],
    setEditQuestions: (questions) => set({ editQuestions: questions }),
    addEditQuestion: (question) =>
      set((state) => ({ editQuestions: [...state.editQuestions, question] })),
    updateEditQuestion: (index, question) =>
      set((state) => {
        const newQuestions = [...state.editQuestions];
        newQuestions[index] = question;
        return { editQuestions: newQuestions };
      }),
    resetEditQuestions: () => set({ editQuestions: [] }),
  })
);
