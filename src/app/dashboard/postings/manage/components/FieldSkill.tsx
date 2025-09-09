'use client'

import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateJobStore } from "@/lib/zustand/createJobStore";
import { apiCall } from "@/helper/apiCall";
import debounce from "lodash.debounce";

const FieldSkill = () => {
  const { skills: skill, addSkill: addSkill, removeSkill } = useCreateJobStore();
  const [skillList, setSkillList] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // Debounce untuk fetch API
  const debouncedFetch = useMemo(
    () =>
      debounce(async (val: string) => {
        if (!val) return;

        try {
          const { data } = await apiCall.get("/postings/get-skill-list", {
            params: { search: val },
          });

          if (data.success) {
            setSkillList(data.data.skillNames ?? []);
          }
        } catch (error) {
          console.error(error);
        }
      }, 1000),
    []
  );

  // Cleanup debounce saat unmount
  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  // Handler input
  const handleInputChange = (val: string) => {
    setInput(val); // update UI
    debouncedFetch(val); // panggil API
  };

  // Filter frontend (hindari duplikat)
  const filteredSkills = skillList.filter(
    (s) => !skill.includes(s)
  );

  return (
    <div className="flex flex-col gap-2 md:col-span-2 relative">
      <label className="text-lg">Skill</label>

      <Command>
        <CommandInput
          placeholder="Search skill..."
          value={input}
          onValueChange={handleInputChange}
        />
        <CommandList>
          {filteredSkills.length === 0 && input && (
            <CommandItem disabled>No results</CommandItem>
          )}
          {filteredSkills.map((s) => (
            <CommandItem
              key={s}
              onSelect={() => {
                addSkill(s);
                setInput(""); // reset input setelah pilih
              }}
            >
              {s}
            </CommandItem>
          ))}
        </CommandList>
      </Command>

      <div className="flex flex-wrap gap-2 mt-2">
        {skill.map((tag) => (
          <Badge
            key={tag}
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
};

export default FieldSkill;
