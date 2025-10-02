import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Question = {
    question: string;
    options: string[];
};

interface FormPertanyaanProps {
    currentIndex: number;
    questions: Question[];
    handleQuestionChange: (index: number, value: string) => void;
    handleOptionChange: (qIndex: number, optIndex: number, value: string) => void;
}

const FormPertanyaan = ({
    currentIndex,
    questions,
    handleQuestionChange,
    handleOptionChange,
}: FormPertanyaanProps) => {
    return (
        <div>
            <Label className="ml-2 text-lg">
                Question {currentIndex + 1} of {questions.length}
            </Label>

            {/* Input pertanyaan */}
            <Input
                value={questions[currentIndex].question}
                onChange={(e) => handleQuestionChange(currentIndex, e.target.value)}
                placeholder={`Enter question ${currentIndex + 1}`}
                className="py-6 !text-lg"
            />

            {/* Input opsi jawaban */}
            <div className="grid grid-cols-2 gap-2 mt-1">
                {["A", "B", "C", "D"].map((opt, idx) => (
                    <div key={idx}>
                        <Label className="ml-2 text-lg">{opt}</Label>
                        <Input
                            value={questions[currentIndex].options[idx] || ""}
                            onChange={(e) =>
                                handleOptionChange(currentIndex, idx, e.target.value)
                            }
                            placeholder={`Option ${opt}`}
                            className="py-6 !text-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormPertanyaan;
