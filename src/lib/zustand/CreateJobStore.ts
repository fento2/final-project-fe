import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  skills: string[];

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
  addSkill: (skills: string) => void;
  removeSkill: (skills: string) => void;
  reset: () => void;
};

export const useCreateJobStore = create<CreateJob>()(
  persist(
    (set) => ({
      title: "",
      description:
        '<p><strong>Description:</strong></p><p><br></p><p><br></p><p><br></p><p><strong>Requirements:</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol><p><br></p><p><br></p><p><strong>Benefits:</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol>',
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

      setTitle: (title) => set({ title: title }),
      setDescription: (description) => set({ description: description }),
      setCategory: (category) => set({ category: category }),
      setLatitude: (latitude) => set({ latitude: latitude }),
      setLongitude: (longitude) => set({ longitude: longitude }),
      setLocation: (location) => set({ location: location }),
      setSalary: (salary) => set({ salary: salary }),
      setJobType: (jobType) => set({ job_type: jobType }),
      setPeriodSalary: (salaryPeriod) => set({ periodSalary: salaryPeriod }),
      setCurrency: (currency) => set({ currency: currency }),
      setExpiredAt: (expiredAt) => set({ expiredAt: expiredAt }),

      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),

      removeSkill: (skill) =>
        set((state) => ({
          skills: state.skills.filter((s) => s !== skill),
        })),

      reset: () =>
        set({
          title: "",
          description:
            '<p><strong>Description:</strong></p><p><br></p><p><br></p><p><br></p><p><strong>Requirements:</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol><p><br></p><p><br></p><p><strong>Benefits:</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><br></li></ol>',
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
      name: "create-job-storage", // key di localStorage
    }
  )
);
