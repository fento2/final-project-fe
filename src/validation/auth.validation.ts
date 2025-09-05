import { z } from "zod";

export const schemaSignIn = z.object({
  email: z.email("Invalid email address"),
  password: z.string().nonempty("Password required"),
  remember: z.boolean(),
});

const passwordSchema = z
  .string()
  .nonempty("Password required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const schemaSignUp = z
  .object({
    name: z.string().nonempty("Name required"),
    role: z.enum(["USER", "COMPANY"], "Invalid Role"),
    username: z.string().nonempty("username required"),
    email: z.email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().nonempty("Confirm Password required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // kasih error ke field confirmPassword
  });
