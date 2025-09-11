import { IQuestion } from "@/lib/zustand/preselectionStore";
import { z } from "zod";
export const schemaPreselectionTest = z.object({
  passingScore: z.number().min(0).max(100),
  questions: z.array(
    z.object({
      question: z.string().min(1, "Question required"),
      option_A: z.string().min(1, "Option A required"),
      option_B: z.string().min(1, "Option B required"),
      option_C: z.string().min(1, "Option C required"),
      option_D: z.string().min(1, "Option D required"),
      correct_option: z.enum(["A", "B", "C", "D"]),
    })
  ),
});

// Transformer dari Zustand ke DB schema
export function transformStoreToBE(input: {
  minScore: number;
  questions: IQuestion[];
}): z.infer<typeof schemaPreselectionTest> {
  return {
    passingScore: input.minScore,
    questions: input.questions.map((q) => ({
      question: q.question,
      option_A: q.options[0] || "",
      option_B: q.options[1] || "",
      option_C: q.options[2] || "",
      option_D: q.options[3] || "",
      correct_option: q.answer as "A" | "B" | "C" | "D",
    })),
  };
}
