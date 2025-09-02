import { create } from "zustand";

type EditJob = {
  editTitle: string;
  editDescription: string;
  editCategory: string;
  editLatitude: number;
  editLongitude: number;
  editLocation: string;
  editSalary: number;
  editJobType: string;
  editSalaryPeriod: string;
  editCurrency: string;
  editExpireAt: string;

  setEditTitle: (title: string) => void;
  setEditDescription: (description: string) => void;
  setEditCategory: (category: string) => void;
  setEditLatitude: (latitude: number) => void;
  setEditLongitude: (longitude: number) => void;
  setEditLocation: (location: string) => void;
  setEditSalary: (salary: number) => void;
  setEditJobType: (jobType: string) => void;
  setEditSalaryPeriod: (salaryPeriod: string) => void;
  setEditCurrency: (currency: string) => void;
  setEditExpireAt: (expiredAt: string) => void;

  reset: () => void;
};

export const useEditJob = create<EditJob>()((set) => ({
  editTitle: "",
  editDescription: "",
  editCategory: "",
  editLatitude: 0,
  editLongitude: 0,
  editLocation: "",
  editSalary: 0,
  editJobType: "",
  editSalaryPeriod: "",
  editCurrency: "",
  editExpireAt: "",

  setEditTitle: (title) => set({ editTitle: title }),
  setEditDescription: (description) => set({ editDescription: description }),
  setEditCategory: (category) => set({ editCategory: category }),
  setEditLatitude: (latitude) => set({ editLatitude: latitude }),
  setEditLongitude: (longitude) => set({ editLongitude: longitude }),
  setEditLocation: (location) => set({ editLocation: location }),
  setEditSalary: (salary) => set({ editSalary: salary }),
  setEditJobType: (jobType) => set({ editJobType: jobType }),
  setEditSalaryPeriod: (salaryPeriod) =>
    set({ editSalaryPeriod: salaryPeriod }),
  setEditCurrency: (currency) => set({ editCurrency: currency }),
  setEditExpireAt: (expiredAt) => set({ editExpireAt: expiredAt }),

  reset: () =>
    set({
      editTitle: "",
      editDescription: "",
      editCategory: "",
      editLatitude: 0,
      editLongitude: 0,
      editLocation: "",
      editSalary: 0,
      editJobType: "",
      editSalaryPeriod: "",
      editCurrency: "",
      editExpireAt: "",
    }),
}));
