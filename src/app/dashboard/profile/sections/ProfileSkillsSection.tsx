"use client";
import React, { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import type { UserSkill } from "@/types/userSkill";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Lightbulb, Plus } from "lucide-react";
import SkillAddModal from "../components/SkillAddModal";
import { Button } from "@/components/ui/button";

export default function ProfileSkillsSection() {
    const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openAdd, setOpenAdd] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                // const [sRes, uRes] = await Promise.all([
                //     apiCall.get("/skill"),       // endpoint list semua skills
                //     apiCall.get("/user-skill"),   // endpoint list user skills (sesuaikan)
                // ]);
                const uRes = await apiCall.get("/user-skill");
                if (!mounted) return;
                // setAvailable(sRes.data?.data ?? sRes.data ?? []);
                setUserSkills(uRes.data?.data ?? []);
            } catch (e: any) {
                setError(e?.response?.data?.message || e?.message || "Failed to load skills");
            } finally {
                if (mounted) setLoading(false);

            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    const handleAdded = (created: UserSkill) => {
        setUserSkills(prev => [created, ...prev]);
    };

    const handleRemove = async (id: number) => {
        const prev = [...userSkills];
        setUserSkills(prev.filter(s => s.id !== id));
        try {
            await apiCall.delete(`/user-skill/${id}`);
        } catch (e: any) {
            setUserSkills(prev);
            setError(e?.response?.data?.message || e?.message || "Failed to remove skill");
        }
    };

    if (loading) return <CardContent><p className="text-sm text-gray-500">Loading skills...</p></CardContent>;

    return (
        <section className="">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-indigo-500 flex items-center gap-2"><Lightbulb /> Skill</h3>
                        <span className="text-sm text-gray-600">
                            Add your Skill.
                        </span>
                    </div>
                    <div>
                        <Button onClick={() => setOpenAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"><Plus /> Add Skill</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-[600px]">
                <div className="flex flex-wrap gap-2">
                    {userSkills.length === 0 && <p className="text-sm text-gray-500">No skills added yet.</p>}
                    {userSkills.map(us => (
                        <div key={us.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <span className="font-medium">{us.skill?.name ?? `Skill #${us.skillId}`}</span>
                            <button
                                onClick={() => handleRemove(us.id)}
                                className="text-xs text-red-600 px-2 py-0.5 rounded hover:bg-red-50"
                                aria-label={`Remove ${us.skill?.name ?? us.skillId}`}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>

            <SkillAddModal
                isOpen={openAdd}
                onClose={() => setOpenAdd(false)}
                onAdded={handleAdded}
                existing={userSkills}
            />
        </section>
    );
}