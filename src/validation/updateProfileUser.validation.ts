import { z } from "zod";

export const schemaUpdateProfileUser = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Only letters, numbers, and _ allowed",
    }),

  email: z.email({ message: "Invalid email address" }),

  phone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Phone must contain only numbers" })
    .min(10, { message: "Phone must be at least 10 digits" })
    .max(15, { message: "Phone must be at most 15 digits" }),

  gender: z.enum(["MALE", "FEMALE"], { message: "Invalid gender" }),

  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format (use YYYY-MM-DD)",
  }),

  avatar: z.url({ message: "Avatar must be a valid URL" }).optional(), // kalau avatar opsional
});
