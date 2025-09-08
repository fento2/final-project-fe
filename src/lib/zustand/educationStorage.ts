import { create } from "zustand";

export type EducationState = {
  university: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
  isEditing: boolean; // tambah isEditing

  // generic setter
  setField: (field: keyof Omit<EducationState, "setField">, value: any) => void;

  // reset state (misal buat clear form atau set data edit)
  reset: (initial?: Partial<Omit<EducationState, "setField">>) => void;
};

export const useEducationStore = create<EducationState>((set) => ({
  university: "",
  degree: "",
  fieldOfStudy: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  description: "",
  isEditing: false, // default false

  setField: (field, value) => set({ [field]: value }),

  reset: (initial) =>
    set({
      university: initial?.university || "",
      degree: initial?.degree || "",
      fieldOfStudy: initial?.fieldOfStudy || "",
      startMonth: initial?.startMonth || "",
      startYear: initial?.startYear || "",
      endMonth: initial?.endMonth || "",
      endYear: initial?.endYear || "",
      description: initial?.description || "",
      isEditing: initial?.isEditing || false,
    }),
}));
