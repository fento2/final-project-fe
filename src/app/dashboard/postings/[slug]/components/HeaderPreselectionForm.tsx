import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface HeaderPreselectionTestFormProps {
    currentIndex: number;
    questions: any[];
    MAX_QUESTIONS: number;
    handleAddQuestion: () => void;
    handleDeleteQuestion: (index: number) => void;
}

const HeaderPreselectionTestForm = ({
    currentIndex,
    questions,
    MAX_QUESTIONS,
    handleAddQuestion,
    handleDeleteQuestion,
}: HeaderPreselectionTestFormProps) => {
    return (
        <CardHeader className="-mx-6 text-2xl font-bold tracking-widest text-indigo-600">
            <div className="flex justify-between items-center">
                {/* Judul */}
                <div>
                    <h1>Preselection Test</h1>
                    <p className="text-sm font-normal text-gray-500 mt-1">
                        Assess candidates’ skills before interview
                    </p>
                </div>

                {/* Tombol Add / Delete */}
                <div className="md:flex-row flex flex-col-reverse gap-2">
                    <Button
                        onClick={() => handleDeleteQuestion(currentIndex)}
                        variant="destructive"
                        className="flex items-center gap-2 md:text-sm text-xs"
                    >
                        Remove <Trash2 size={16} />
                    </Button>
                    <Button
                        onClick={handleAddQuestion}
                        disabled={questions.length >= MAX_QUESTIONS}
                        className="flex items-center gap-2 md:text-sm text-xs"
                    >
                        Add <Plus size={16} />
                    </Button>
                </div>
            </div>
        </CardHeader>
    );
};

export default HeaderPreselectionTestForm;
