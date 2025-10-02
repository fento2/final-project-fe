import z from "zod";

export interface ParsedQuestion {
    assessment_question_id?: string | number;
    assessment_id?: number;
    question: string;
    option_a?: string;
    option_b?: string;
    option_c?: string;
    option_d?: string;
    correct_option?: string;
    // [key: string]: any;
}

export const QuestionRowSchema = z.object({
    assessment_question_id: z.number().optional(),
    question: z.string().min(1),
    option_a: z.string(),
    option_b: z.string().optional().nullable(),
    option_c: z.string().optional().nullable(),
    option_d: z.string().optional().nullable(),
    correct_option: z.union([z.literal("A"), z.literal("B"), z.literal("C"), z.literal("D")]),
});
export type QuestionRow = z.infer<typeof QuestionRowSchema>;

export const FormSchema = z.object({
    file: z
        .instanceof(File, { message: "File harus diupload" })
        .refine(
            (f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls"),
            { message: "Format file harus .xlsx atau .xls" }
        ).optional(),
});
export type FormValues = z.infer<typeof FormSchema>;