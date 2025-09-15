import { z } from "zod";

export const schemaInterviewInput = z
  .object({
    application_id: z.number(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    note: z.string().min(1, "Note is required"),
    location: z.string().min(1, "Location is required"),
  })
  .refine((data) => new Date(data.startDate) >= new Date(), {
    message: "Start date cannot be in the past",
    path: ["startDate"], // menandai field yang error
  })
  .refine((data) => new Date(data.endDate) >= new Date(), {
    message: "End date cannot be in the past",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Type otomatis
export type InterviewInput = z.infer<typeof schemaInterviewInput>;
