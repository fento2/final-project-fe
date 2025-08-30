// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface PreselectionTest {
//   question: string;
//   options: string[]; // [A, B, C, D]
//   answer: string; // jawaban benar: "A" | "B" | "C" | "D"
// }

// export const useCreateJob = create<>()(
//   persist(
//     (set) => ({
//       title: "",
//       description: "",
//       category: "",
//       latitude: 0,
//       longitude: 0,
//       location: "",
//       salary: 0,
//       jobType: "",
//       preSelection: false,

//       setTitle: (title) => set({ title }),
//       setDescription: (description) => set({ description }),
//       setCategory: (category) => set({ category }),
//       setLatitude: (latitude) => set({ latitude }),
//       setLongitude: (longitude) => set({ longitude }),
//       setLocation: (location) => set({ location }),
//       setSalary: (salary) => set({ salary }),
//       setJobType: (jobType) => set({ jobType }),
//       setPreSelection: (preSelection) => set({ preSelection }),

//       reset: () =>
//         set({
//           title: "",
//           description: "",
//           category: "",
//           latitude: 0,
//           longitude: 0,
//           location: "",
//           salary: 0,
//           jobType: "",
//           preSelection: false,
//         }),
//     }),
//     {
//       name: "create-job-storage", // key di localStorage
//     }
//   )
// );
