import { ParsedQuestion, QuestionRow } from "../types/questionAssessment";

// type Props = { questions: ParsedQuestion[] };
type Props = { questions: Array<ParsedQuestion | QuestionRow> }

export default function TableQuestionPreview({ questions }: Props) {
    return (
        <div className="relative rounded-md border overflow-x-auto max-h-[50vh] overflow-y-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="text-left">
                        <th className="p-2 w-10">#</th>
                        <th className="p-2">Question</th>
                        <th className="p-2">A</th>
                        <th className="p-2">B</th>
                        <th className="p-2">C</th>
                        <th className="p-2">D</th>
                        <th className="p-2">Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-2 text-xs text-gray-500">{q.assessment_question_id ?? i + 1}</td>
                            <td className="p-2">{q.question}</td>
                            <td className="p-2">{q.option_a}</td>
                            <td className="p-2">{q.option_b}</td>
                            <td className="p-2">{q.option_c}</td>
                            <td className="p-2">{q.option_d}</td>
                            <td className="p-2 font-medium">{q.correct_option?.toUpperCase()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}