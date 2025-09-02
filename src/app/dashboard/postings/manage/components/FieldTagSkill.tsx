"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useCreateJob } from "@/lib/zustand/createJobStore";

export default function TagInput() {
  const [value, setValue] = useState("");
  const { skill, addSkill, removeSkill } = useCreateJob();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (value.trim() === "") return;
    if (skill.includes(value)) return; // biar ga duplikat
    if (skill.length >= 6) return;
    if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      if (!skill.includes(value.trim())) {
        addSkill(value.trim());
      }
      setValue("");
    }
  };

  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <Label className="text-lg">Skill</Label>
      <Input
        placeholder="Type and press Enter..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="py-6 !text-lg"
      />
      <div className="flex flex-wrap gap-2">
        {skill.map((tag, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="flex items-center gap-1 p-2 text-sm"
          >
            {tag}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => removeSkill(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
