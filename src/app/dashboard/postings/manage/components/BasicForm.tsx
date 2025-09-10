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
import { useCreateJobStore } from "@/lib/zustand/createJobStore";
import { useEditJobStore } from "@/lib/zustand/editJobStore";
import { usePathname } from "next/navigation";


import { useGeneralDataStore } from "@/lib/zustand/generalData";
import { toTitleCase } from "@/helper/toTitleCase";
import FieldSkill from "./FieldSkill";
const BasicForm = () => {
  const pathname = usePathname();
  const {
    title,
    category,
    salary,
    job_type: jobType,
    periodSalary: salaryPeriod,
    currency,
    setTitle,
    setSalary,
    setPeriodSalary: setSalaryPeriod,
    setCurrency,
    setCategory,
    setJobType,
  } = useCreateJobStore();
  const {
    editTitle,
    editCategory,
    editSalary,
    editJobType,
    editPeriodSalary: editSalaryPeriod,
    editCurrency,
    setEditTitle,
    setEditSalary,
    setEditPeriodSalary: setEditSalaryPeriod,
    setEditCurrency,
    setEditCategory,
    setEditJobType,
  } = useEditJobStore();


  const { categories, jobTypes, currencies, periodSalary } = useGeneralDataStore()

  return (
    <>
      {/* Job Title */}
      <div className="md:col-span-2">
        <Label htmlFor="title" className="text-lg">
          Job Title
        </Label>
        <Input
          id="title"
          value={getValue(title, editTitle, pathname)}
          onChange={(e) =>
            setValue(setTitle, setEditTitle, e.target.value, pathname)
          }
          placeholder="Job Title"
          className="py-6 !text-lg w-full"
        />
      </div>

      {/* Category */}
      <div className="md:col-span-2">
        <Label htmlFor="category" className="text-lg">
          Category
        </Label>
        <Select
          onValueChange={(val) =>
            setValue(setCategory, setEditCategory, val, pathname)
          }
          value={getValue(category, editCategory, pathname)}
        >
          <SelectTrigger className="w-full p-6 text-lg">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat, idx) => (
              <SelectItem
                key={idx}
                value={cat}
                className="p-4 text-lg"
              >
                {toTitleCase(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Type */}
      <div className="md:col-span-2">
        <Label htmlFor="jobType" className="text-lg">
          Job Type
        </Label>
        <Select
          onValueChange={(val) =>
            setValue(setJobType, setEditJobType, val, pathname)
          }
          value={getValue(jobType, editJobType, pathname)}
        >
          <SelectTrigger className="w-full p-6 text-lg">
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            {jobTypes.map((type, idx) => (
              <SelectItem
                key={idx}
                value={type}
                className="p-4 text-lg"
              >
                {toTitleCase(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
