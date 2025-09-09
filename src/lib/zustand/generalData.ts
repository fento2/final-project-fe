import { create } from "zustand";

type GeneralDataState = {
  categories: string[];
  jobTypes: string[];
  skillNames: string[];
  periodSalary: string[];
  currencies: string[];

  setCategories: (categories: string[]) => void;
  setJobTypes: (jobTypes: string[]) => void;
  setSkillNames: (skillNames: string[]) => void;
  setPeriodSalary: (periodSalary: string[]) => void;
  setCurrencies: (currencies: string[]) => void;
  reset: () => void;
};

const initialState = {
  categories: [],
  jobTypes: [],
  skillNames: [],
  periodSalary: [],
  currencies: [],
};

export const useGeneralDataStore = create<GeneralDataState>((set) => ({
  ...initialState,

  setCategories: (categories) => set({ categories }),
  setJobTypes: (jobTypes) => set({ jobTypes }),
  setSkillNames: (skillNames) => set({ skillNames }),
  setPeriodSalary: (periodSalary) => set({ periodSalary }),
  setCurrencies: (currencies) => set({ currencies }),

  reset: () => set(initialState),
}));
