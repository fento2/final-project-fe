import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateJobStore } from "@/lib/zustand/createJobStore";
import { apiCall } from "@/helper/apiCall";

const FieldSkill = () => {
  const { skill, addSkill, removeSkill } = useCreateJobStore();
  const [skillList, setSkillList] = useState<string[]>([])
  const [input, setInput] = useState("");

  // Filtered skill otomatis
  const filteredSkills = skillList.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !skill.includes(s)
  );


  const getGeneralData = async () => {
    try {

      const { data } = await apiCall.get('/general/get-data')
      if (data.success) {
        setSkillList(data.data.skillList)
        console.log("fetch skillList", data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGeneralData()
  }, [input])


  return (
    <div className="flex flex-col gap-2 md:col-span-2 relative">
      <label className="text-lg">Skill</label>

      <Command>
        <CommandInput
          placeholder="Search skill..."
          value={input}
          onValueChange={(val) => setInput(val)}
        />
        <CommandList>
          {filteredSkills.map((s) => (
            <CommandItem
              key={s}
              onSelect={() => {
                addSkill(s);
                setInput("");
              }}
            >
              {s}
            </CommandItem>
          ))}
        </CommandList>
      </Command>

      <div className="flex flex-wrap gap-2 mt-2">
        {skill.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1 p-2 text-sm">
            {tag}
            <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(tag)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FieldSkill;
