'use client'
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateJobStore } from "@/lib/zustand/createJobStore";
import { apiCall } from "@/helper/apiCall";
import debounce from "lodash.debounce";
import { useEditJobStore } from "@/lib/zustand/editJobStore";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/basic-toast";
const FieldSkill = () => {
  const { skills, addSkill, removeSkill } = useCreateJobStore();
  const { editSkills, addEditSkill, removeEditSkill } = useEditJobStore();
  const [skillList, setSkillList] = useState<{ id: string; name: string }[]>([]);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const isEdit = pathname.includes("edit");
  const toast = useToast()

  // pilih state & action sesuai mode
  const currentSkills = isEdit ? editSkills : skills;
  const addCurrentSkill = isEdit ? addEditSkill : addSkill;
  const removeCurrentSkill = isEdit ? removeEditSkill : removeSkill;

  // Debounce untuk fetch API
  const debouncedFetch = useMemo(
    () =>
      debounce(async (val: string) => {
        if (!val) return setSkillList([]);
        try {
          const { data } = await apiCall.get("/postings/get-skill-list", {
            params: { search: val },
          });
          if (data.success) {
            setSkillList(data.data.skills ?? []);
          }
        } catch (error) {
          console.error(error);
        }
      }, 1000),
    []
  );

  useEffect(() => {
    console.log(currentSkills)
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleInputChange = (val: string) => {
    setInput(val);
    debouncedFetch(val);
  };

  const filteredSkills = skillList.filter(
    (s) => !currentSkills.some((c) => c.id === s.id) // hindari duplikat
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
          {filteredSkills.map((s, idx) => (
            <CommandItem
              key={idx}
              onSelect={() => {
                if (currentSkills.length >= 7) {
                  toast.error('Max skill tag 7')
                  return;
                }
                addCurrentSkill(s); // pakai store sesuai mode
                setInput("");
              }}
            >
              {s.name}
            </CommandItem>
          ))}
        </CommandList>
      </Command>

      <div className="flex flex-wrap gap-2 mt-2">
        {currentSkills.map((skill, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="flex items-center gap-1 p-2 text-sm"
          >
            {skill.name}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => removeCurrentSkill(skill.id)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FieldSkill