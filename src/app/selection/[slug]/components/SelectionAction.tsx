'use client'
import { Button } from "@/components/ui/button"
import { SelectionTest } from "../page"
import { Dispatch, SetStateAction, useState } from "react"

interface SelectionActionProps {
    setCurrent: Dispatch<SetStateAction<number>>
    current: number
    selectionTest: SelectionTest
    handleSubmit: () => Promise<void>

}

const SelectionAction = ({ setCurrent, current, selectionTest, handleSubmit }: SelectionActionProps) => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
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
                    <Button
                        className="px-6 py-3 text-lg bg-indigo-500 hover:bg-indigo-500"
                        onClick={() => setShowConfirm(true)}
                    >
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

            {/* Modal konfirmasi */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">Konfirmasi Submit</h2>
                        <p className="mb-6">Apakah kamu yakin ingin submit jawabanmu?</p>
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setShowConfirm(false)}>
                                Batal
                            </Button>
                            <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={handleSubmit}>
                                Ya, Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SelectionAction;
