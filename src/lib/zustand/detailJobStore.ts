import { create } from "zustand";

interface ISkill {
  id: number;
  name: string;
}

interface IJobDetail {
  job_id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  salary: number;
  periodSalary: string;
  currency: string;
  expiredAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  category: string;
  job_type: string;
  latitude: string;
  longitude: string;
  preselection_test: boolean;
  skills: ISkill[];
}

interface JobDetailState {
  jobDetail: IJobDetail | null;
  setJobDetail: (job: IJobDetail) => void;
  updateSkill: (skills: ISkill[]) => void;
  resetJobDetail: () => void;
}

export const useJobDetailStore = create<JobDetailState>((set) => ({
  jobDetail: null,
  setJobDetail: (job) => set({ jobDetail: job }),
  updateSkill: (skills) =>
    set((state) => ({
      jobDetail: state.jobDetail ? { ...state.jobDetail, skills } : null,
    })),
  resetJobDetail: () => set({ jobDetail: null }),
}));
