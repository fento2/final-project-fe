import { create } from "zustand";
import { persist } from "zustand/middleware";

type Skill = {
  id: string;
  name: string;
};

type CreateJob = {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  location: string;
  salary: number;
  job_type: string;
  periodSalary: string;
  currency: string;
  expiredAt: string;
  skills: Skill[];

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
  setLocation: (location: string) => void;
  setSalary: (salary: number) => void;
  setJobType: (job_type: string) => void;
  setPeriodSalary: (periodSalary: string) => void;
  setCurrency: (currency: string) => void;
  setExpiredAt: (expiredAt: string) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  reset: () => void;
};

export const useCreateJobStore = create<CreateJob>()(
  persist(
    (set) => ({
      title: "",
      description:
        '<p><strong>Description:</strong></p><p><br></p><p><br></p><p><br></p><p><strong>Requirements:</strong></p><ol><li data-list="bullet"></li><li data-list="bullet"></li><li data-list="bullet"></li></ol><p><br></p><p><br></p><p><strong>Benefits:</strong></p><ol><li data-list="bullet"></li><li data-list="bullet"></li><li data-list="bullet"></li></ol>',
      category: "",
      latitude: 0,
      longitude: 0,
      location: "",
      salary: 0,
      job_type: "",
      periodSalary: "",
      currency: "",
      expiredAt: "",
      skills: [],

      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setCategory: (category) => set({ category }),
      setLatitude: (latitude) => set({ latitude }),
      setLongitude: (longitude) => set({ longitude }),
      setLocation: (location) => set({ location }),
      setSalary: (salary) => set({ salary }),
      setJobType: (job_type) => set({ job_type }),
      setPeriodSalary: (periodSalary) => set({ periodSalary }),
      setCurrency: (currency) => set({ currency }),
      setExpiredAt: (expiredAt) => set({ expiredAt }),

      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),

      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      reset: () =>
        set({
          title: "",
          description:
            '<p><strong>Description:</strong></p><p><br></p><p><br></p><p><br></p><p><strong>Requirements:</strong></p><ol><li data-list="bullet"></li><li data-list="bullet"></li><li data-list="bullet"></li></ol><p><br></p><p><br></p><p><strong>Benefits:</strong></p><ol><li data-list="bullet"></li><li data-list="bullet"></li><li data-list="bullet"></li></ol>',
          category: "",
          latitude: 0,
          longitude: 0,
          location: "",
          salary: 0,
          job_type: "",
          periodSalary: "",
          currency: "",
          expiredAt: "",
          skills: [],
        }),
    }),
    {
      name: "create-job-storage",
    }
  )
);
