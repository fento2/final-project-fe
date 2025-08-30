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
  jobType: string;
  preSelection: boolean;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
  setLocation: (location: string) => void;
  setSalary: (salary: number) => void;
  setJobType: (jobType: string) => void;
  setPreSelection: (preSelection: boolean) => void;

  reset: () => void;
};

export const useCreateJob = create<CreateJob>()(
  persist(
    (set) => ({
      title: "",
      description: "",
      category: "",
      latitude: 0,
      longitude: 0,
      location: "",
      salary: 0,
      jobType: "",
      preSelection: false,

      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      setCategory: (category) => set({ category }),
      setLatitude: (latitude) => set({ latitude }),
      setLongitude: (longitude) => set({ longitude }),
      setLocation: (location) => set({ location }),
      setSalary: (salary) => set({ salary }),
      setJobType: (jobType) => set({ jobType }),
      setPreSelection: (preSelection) => set({ preSelection }),

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
        }),
    }),
    {
      name: "create-job-storage", // key di localStorage
    }
  )
);
