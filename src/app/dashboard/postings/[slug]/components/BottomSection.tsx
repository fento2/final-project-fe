"use client";

import { Button } from "@/components/ui/button";
import { usePreselectionStore } from "@/lib/zustand/preselectionStore";
import { Plus, Edit, Trash2, CheckCircle } from "lucide-react";

interface PreselectionControlProps {
    initialEnabled: boolean; // cuma 1 parameter aja
}

const PreselectionControl = ({ initialEnabled }: PreselectionControlProps) => {
    const { setShowForm } = usePreselectionStore()
    return (
        <section className="mt-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
                Preselection Test
                {initialEnabled && (
                    <CheckCircle className="text-green-600 w-5 h-5" />
                )}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                {initialEnabled ? (
                    <>
                        <Button className="bg-red-500 hover:bg-red-600 flex items-center gap-2">
                            <Trash2 size={16} /> Delete
                        </Button>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2"
                            onClick={() => setShowForm(true)}>
                            <Edit size={16} /> Edit
                        </Button>
                    </>
                ) : (
                    <Button className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2"
                        onClick={() => setShowForm(true)}>
                        <Plus size={16} /> Add
                    </Button>
                )}
            </div>
        </section>
    );
};

export default PreselectionControl;
