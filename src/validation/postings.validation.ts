import { z } from "zod";

export const schemaJobsInput = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),

  category: z.string().min(1, "Category is required"), // string biasa
  job_type: z.string().min(1, "Job type is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),

  salary: z.number().positive("Salary must be positive"),
  periodSalary: z.string().min(1, "Period is required"), // string
  currency: z.string().default("USD"), // string

  expiredAt: z.string().refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      return !isNaN(date.getTime()) && date >= now;
    },
    {
      message: "Expire date must be a valid date and cannot be in the past",
    }
  ),

  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),

  location: z.string().min(2, "Location is required"),
  description: z
    .string()
    .min(10, "Job description must be at least 10 characters")
    .max(10000, "Job description too long"),
});

// auto type
export type SchemaJobsInput = z.infer<typeof schemaJobsInput>;
