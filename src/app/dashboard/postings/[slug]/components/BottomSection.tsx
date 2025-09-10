"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check } from "lucide-react";

interface PreselectionControlProps {
    initialEnabled: boolean;
    onSave: (enabled: boolean) => Promise<void>;
    onEdit?: () => void;
}

const PreselectionControl = ({ initialEnabled, onSave, onEdit }: PreselectionControlProps) => {
    const [enabled, setEnabled] = useState(initialEnabled);

    const handleAdd = () => setEnabled(true);
    const handleDelete = () => setEnabled(false);
    const handleSave = async () => {
        await onSave(enabled);
    };

    return (
        <section className="mt-6">
            <Label className="text-lg font-medium">Preselection Test</Label>

            <div className="mt-3 flex items-center gap-4">
                {/* Switch */}
                <Switch
                    checked={enabled}
                    onCheckedChange={setEnabled}
                    className="bg-gray-300 data-[state=checked]:bg-indigo-500 relative rounded-full transition-colors"
                />

                {/* Tombol Add / Edit / Delete */}
                {!enabled ? (
                    <Button variant="default" className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2" onClick={handleAdd}>
                        <Plus size={16} /> Add
                    </Button>
                ) : (
                    <>
                        {onEdit && (
                            <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2" onClick={onEdit}>
                                <Edit size={16} /> Edit
                            </Button>
                        )}
                        <Button variant="default" className="bg-red-500 hover:bg-red-600 flex items-center gap-2" onClick={handleDelete}>
                            <Trash2 size={16} /> Delete
                        </Button>
                    </>
                )}
            </div>

            {/* Tombol Save */}
            <div className="mt-3">
                <Button variant="default" className="bg-indigo-500 hover:bg-indigo-700 flex items-center gap-2" onClick={handleSave}>
                    <Check size={16} /> Save
                </Button>
            </div>
        </section>
    );
};

export default PreselectionControl;
