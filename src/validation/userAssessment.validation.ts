import z from "zod";

export const userAssessmentCreateSchema = z.object({
    assessment_id: z.number().int().positive(),
    // user_id: z.number().int().positive(),
    score: z.number().min(0).max(100),
});

export type UserAssessmentCreateDTO = z.infer<typeof userAssessmentCreateSchema>;