import { z } from "zod";

export const schemaUpdateProfileUser = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  phone: z.string(),
  gender: z.enum(["MALE", "FEMALE"], "invalid gender"),
  birthDate: z.string(),
  profile_picture: z.any().optional(), // bisa undefined kalau tidak ganti foto
  address: z.string(),
});
