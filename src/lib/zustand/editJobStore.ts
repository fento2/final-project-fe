import { create } from "zustand";

type EditJob = {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  location: string;
  salary: number;
  jobType: string;
  preSelection: boolean;
  salaryPeriod: string;
  currency: string;
  expiredAt: string;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
  setLocation: (location: string) => void;
  setSalary: (salary: number) => void;
  setJobType: (jobType: string) => void;
  setPreSelection: (preSelection: boolean) => void;
  setSalaryPeriod: (salaryPeriod: string) => void;
  setCurrency: (currency: string) => void;
  setExpiredAt: (expiredAt: string) => void;

  reset: () => void;
};

export const useEditJob = create<EditJob>()((set) => ({
  title: "",
  description: "",
  category: "",
  latitude: 0,
  longitude: 0,
  location: "",
  salary: 0,
  jobType: "",
  preSelection: false,
  salaryPeriod: "",
  currency: "",
  expiredAt: "",

  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setCategory: (category) => set({ category }),
  setLatitude: (latitude) => set({ latitude }),
  setLongitude: (longitude) => set({ longitude }),
  setLocation: (location) => set({ location }),
  setSalary: (salary) => set({ salary }),
  setJobType: (jobType) => set({ jobType }),
  setPreSelection: (preSelection) => set({ preSelection }),
  setSalaryPeriod: (salaryPeriod) => set({ salaryPeriod }),
  setCurrency: (currency) => set({ currency }),
  setExpiredAt: (expiredAt) => set({ expiredAt }),

  reset: () =>
    set({
      title: "",
      description: "",
      category: "",
      latitude: 0,
      longitude: 0,
      location: "",
      salary: 0,
      jobType: "",
      preSelection: false,
      salaryPeriod: "",
      currency: "",
      expiredAt: "",
    }),
}));
