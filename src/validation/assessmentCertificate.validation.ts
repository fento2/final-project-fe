import z from "zod";

export const AssessmentCertificateCreateSchema = z.object({
    user_assessment_id: z.number().int(),
    certificate_code: z.string(),
});

export type AssessmentCertificateCreateDTO = z.infer<typeof AssessmentCertificateCreateSchema>;

export const AssessmentCertificateSchema = z.object({
    assessment_certificate_id: z.number().int(),
    user_assessment_id: z.number().int(),
    certificate_code: z.string(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type AssessmentCertificateDTO = z.infer<typeof AssessmentCertificateSchema>;
