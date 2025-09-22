import { Button } from "@/components/ui/button"
import { SelectionTest } from "../page"
import { Dispatch, SetStateAction } from "react"

interface SelectionActionProps {
    setCurrent: Dispatch<SetStateAction<number>>
    current: number
    selectionTest: SelectionTest
    handleSubmit: () => Promise<void>

}

const SelectionAction = ({ setCurrent, current, selectionTest, handleSubmit }: SelectionActionProps) => {
    return <>
        <div className="flex justify-between pt-8">
            <Button
                variant="outline"
                className="px-6 py-3 text-lg"
                onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
                disabled={current === 0}
            >
                Sebelumnya
            </Button>
            {current === selectionTest.selection_questions.length - 1 ? (
                <Button className="px-6 py-3 text-lg" onClick={handleSubmit}>
                    Submit
                </Button>
            ) : (
                <Button
                    className="px-6 py-3 text-lg"
                    onClick={() =>
                        setCurrent((c) => Math.min(c + 1, selectionTest.selection_questions.length - 1))
                    }
                >
                    Selanjutnya
                </Button>
            )}
        </div>
    </>
}
export default SelectionAction