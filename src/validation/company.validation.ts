import { z } from "zod";

export const schemaUpdateCompanyProfile = z.object({
  name: z.string().min(2).max(100),

  phone: z
    .string()
    .regex(/^[0-9+\-()\s]{8,20}$/, "Invalid phone format")
    .or(z.literal("")) // boleh kosong string
    .nullable() // boleh null
    .optional(), // boleh undefined

  website: z
    .string()
    .url("Invalid website URL")
    .or(z.literal("")) // boleh kosong string
    .nullable()
    .optional(),

  description: z
    .string()
    .max(20000, "Description too long")
    .or(z.literal("")) // boleh kosong string
    .nullable()
    .optional(),

  profile_picture: z
    .instanceof(File) // file upload dari FormData
    .nullable() // boleh null
    .optional(),
});

// Auto-generate TS type
export type SchemaUpdateCompanyProfile = z.infer<
  typeof schemaUpdateCompanyProfile
>;
