import { create } from "zustand";

type Skill = {
  id: string;
  name: string;
};

type EditJob = {
  editTitle: string;
  editDescription: string;
  editCategory: string;
  editLatitude: number;
  editLongitude: number;
  editLocation: string;
  editSalary: number;
  editJobType: string;
  editPeriodSalary: string;
  editCurrency: string;
  editExpiredAt: string;
  editSkills: Skill[];

  setEditTitle: (title: string) => void;
  setEditDescription: (description: string) => void;
  setEditCategory: (category: string) => void;
  setEditLatitude: (latitude: number) => void;
  setEditLongitude: (longitude: number) => void;
  setEditLocation: (location: string) => void;
  setEditSalary: (salary: number) => void;
  setEditJobType: (jobType: string) => void;
  setEditPeriodSalary: (periodSalary: string) => void;
  setEditCurrency: (currency: string) => void;
  setEditExpireAt: (expiredAt: string) => void;

  addEditSkill: (skill: Skill) => void;
  removeEditSkill: (id: string) => void;
  setEditSkills: (skills: Skill[]) => void;

  reset: () => void;
};

export const useEditJobStore = create<EditJob>()((set) => ({
  editTitle: "",
  editDescription: "",
  editCategory: "",
  editLatitude: 0,
  editLongitude: 0,
  editLocation: "",
  editSalary: 0,
  editJobType: "",
  editPeriodSalary: "",
  editCurrency: "",
  editExpiredAt: "",
  editSkills: [],

  setEditTitle: (title) => set({ editTitle: title }),
  setEditDescription: (description) => set({ editDescription: description }),
  setEditCategory: (category) => set({ editCategory: category }),
  setEditLatitude: (latitude) => set({ editLatitude: latitude }),
  setEditLongitude: (longitude) => set({ editLongitude: longitude }),
  setEditLocation: (location) => set({ editLocation: location }),
  setEditSalary: (salary) => set({ editSalary: salary }),
  setEditJobType: (jobType) => set({ editJobType: jobType }),
  setEditPeriodSalary: (periodSalary) =>
    set({ editPeriodSalary: periodSalary }),
  setEditCurrency: (currency) => set({ editCurrency: currency }),
  setEditExpireAt: (expiredAt) => set({ editExpiredAt: expiredAt }),

  addEditSkill: (skill) =>
    set((state) => ({
      editSkills: [...state.editSkills, skill],
    })),

  removeEditSkill: (id) =>
    set((state) => ({
      editSkills: state.editSkills.filter((s) => s.id !== id),
    })),

  setEditSkills: (skills) => set({ editSkills: skills }),

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
      editPeriodSalary: "",
      editCurrency: "",
      editExpiredAt: "",
      editSkills: [],
    }),
}));
