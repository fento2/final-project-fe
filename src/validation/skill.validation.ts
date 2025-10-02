import z from "zod";

export const skillSchema = z.object({
    skill_name: z.string().min(1, "Skill name required"),
});