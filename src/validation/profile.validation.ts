import { convertMonthYearToDate, months } from "@/helper/profileHelper";
import { z } from "zod";

export const schemaUpdateProfileUser = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  phone: z.string(),
  gender: z.enum(["MALE", "FEMALE"], "invalid gender"),
  birthDate: z.string(),
  profile_picture: z.any().optional(), // bisa undefined kalau tidak ganti foto
  address: z.string(),
});
export const schemaCreateEducation = z
  .object({
    university: z.string().min(1, "University is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    startMonth: z.enum(months),
    startYear: z.number(),
    endMonth: z.enum(months).optional(),
    endYear: z.number().optional(),
    description: z.string().optional(),
  })
  .refine((data) => !(data.endMonth && !data.endYear), {
    message: "End year must be provided if end month is set",
    path: ["endYear"],
  })
  .transform((data) => ({
    university: data.university,
    degree: data.degree,
    fieldOfStudy: data.fieldOfStudy,
    startDate: convertMonthYearToDate(data.startMonth, data.startYear),
    endDate:
      data.endMonth && data.endYear
        ? convertMonthYearToDate(data.endMonth, data.endYear)
        : null,
    description: data.description,
  }))
  .refine((data) => !data.endDate || data.startDate! <= data.endDate!, {
    message: "Start date must be before end date",
  });
