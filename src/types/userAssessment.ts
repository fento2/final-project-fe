import z from "zod";

export const AssessmentSchema = z.object({
    assessment_id: z.number().int(),
    skill_name: z.string(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional(),
})

export const AssessmentCertificateSchema = z.object({
    assessment_certificate_id: z.number().int(),
    user_assessment_id: z.number().int(),
    certificate_code: z.string(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const UserAssessmentSchema = z.object({
    user_assessment_id: z.number().int(),
    assessment_id: z.number().int(),
    user_id: z.number().int(),
    score: z.number().int().nullable().optional(),
    date_taken: z.date().optional(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),

    assessment: AssessmentSchema,
    assessment_certificates: AssessmentCertificateSchema,
});

export type UserAssessment = z.infer<typeof UserAssessmentSchema>;