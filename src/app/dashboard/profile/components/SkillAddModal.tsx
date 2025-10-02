"use client";
import React, { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import type { Skill, UserSkill } from "@/types/userSkill";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onAdded: (created: UserSkill) => void;
    existing: UserSkill[];
};

export default function SkillAddModal({ isOpen, onClose, onAdded, existing }: Props) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selected, setSelected] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [popOpen, setPopOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        setSelected("");
        if (!isOpen) return;
        (async () => {
            setLoading(true);
            try {
                const res = await apiCall.get("/skill");
                if (!mounted) return;
                setSkills(res.data?.data ?? []);
            } catch (e: any) {
                setError(e?.response?.data?.message || e?.message || "Failed to load skills");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [isOpen]);

    const handleAdd = async () => {
        if (!selected) return;

        if (existing.some(us => us.skillId === selected)) {
            setError("You already added this skill.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const res = await apiCall.post("/user-skill", { skillId: selected });
            const created: UserSkill = res.data?.data ?? [];
            onAdded(created);
            setSelected("");
            onClose();
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "Failed to add skill");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            {loading && <p className="text-sm text-gray-500 mb-2">Loading skills...</p>}
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">Add Skill</h4>
                    <button onClick={onClose} className="text-sm text-gray-500"><X /></button>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1">Select skill</label>

                    <div className="mb-3">
                        <Popover open={popOpen} onOpenChange={setPopOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                    {selected ? (skills.find(s => s.id === selected))?.name : "Search or select a skill"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Command className="w-full">
                                    <CommandInput placeholder="Search or select a skill" />
                                    <CommandList>
                                        <CommandEmpty>No Skill found.</CommandEmpty>
                                        <CommandGroup>
                                            {
                                                skills.map((s) => (
                                                    <CommandItem
                                                        key={s.id}
                                                        value={s.name}
                                                        onSelect={() => {
                                                            setSelected(Number(s.id));
                                                            setPopOpen(false);
                                                        }}
                                                    >
                                                        {s.name}
                                                    </CommandItem>
                                                ))
                                            }
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                        {selected ? (
                            <div className="mt-2 text-sm text-gray-700">Selected: <span className="font-medium">{skills.find(s => s.id === selected)?.name}</span></div>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                    <Button
                        onClick={handleAdd}
                        disabled={!selected || saving}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {saving ? "Adding..." : "Add Skill"}
                    </Button>
                </div>
            </div>
        </div>
    );
}