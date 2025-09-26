'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValue, setValue } from "@/helper/postingsHelper";
import { useCreateJobStore } from "@/lib/zustand/postingCreateStore";
import { useEditJobStore } from "@/lib/zustand/editJobStore";
import { usePathname } from "next/navigation";
import { useGeneralDataStore } from "@/lib/zustand/generalData";
import { toTitleCase } from "@/helper/toTitleCase";
import FieldSkill from "./FieldSkill";
import { FirstSectionForm } from "./SelectComponents";
const BasicForm = () => {
  const pathname = usePathname();
  const {
    salary,
    periodSalary: salaryPeriod,
    currency,
    setSalary,
    setPeriodSalary: setSalaryPeriod,
    setCurrency,
  } = useCreateJobStore();
  const {
    editSalary,
    editPeriodSalary: editSalaryPeriod,
    editCurrency,
    setEditSalary,
    setEditPeriodSalary: setEditSalaryPeriod,
    setEditCurrency,
  } = useEditJobStore();
  const { currencies, periodSalary } = useGeneralDataStore()

  return (
    <>
      <FirstSectionForm />

      <FieldSkill />

      {/* Salary */}
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Label htmlFor="salary" className="text-lg">
            Salary
          </Label>
          <Input
            id="salary"
            type="number"
            value={getValue(salary, editSalary, pathname)}
            onChange={(e) =>
              setValue(
                setSalary,
                setEditSalary,
                Number(e.target.value),
                pathname
              )
            }
            placeholder="Enter salary"
            className="py-6 !text-lg w-full"
          />
        </div>

        {/* Salary Period */}
        <div>
          <Label className="text-lg">Period</Label>
          <Select
            onValueChange={(val) =>
              setValue(setSalaryPeriod, setEditSalaryPeriod, val, pathname)
            }
            value={getValue(salaryPeriod, editSalaryPeriod, pathname)}
          >
            <SelectTrigger className="w-full sm:w-40 text-lg py-6">
              <SelectValue placeholder="/ Month" />
            </SelectTrigger>
            <SelectContent>
              {periodSalary.map((period, idx) => (
                <SelectItem
                  key={idx}
                  value={period}
                  className="text-lg p-4"
                >
                  <span>
                    / <span className="italic">{toTitleCase(period)}</span>
                  </span>

                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div>
          <Label className="text-lg">Currency</Label>
          <Select
            onValueChange={(val) =>
              setValue(setCurrency, setEditCurrency, val, pathname)
            }
            value={getValue(currency, editCurrency, pathname)}
          >
            <SelectTrigger className="w-full sm:w-32 py-6 text-lg">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((cur) => (
                <SelectItem
                  key={cur}
                  value={cur}
                  className="text-lg p-4"
                >
                  <span>
                    <span className="italic">{toTitleCase(cur)}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
export default BasicForm;
