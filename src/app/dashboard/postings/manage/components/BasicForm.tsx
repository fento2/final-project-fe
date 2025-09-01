import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  currencies,
  JOB_CATEGORIES,
  JOB_TYPES,
  salaryPeriods,
} from "@/constants/jobConstant";
import { getValue, setValue } from "@/helper/postingsHelper";
import { useCreateJob } from "@/lib/zustand/createJobStore";
import { useEditJob } from "@/lib/zustand/editJobStore";
import { usePathname } from "next/navigation";
const BasicForm = () => {
  const pathname = usePathname();
  const {
    title,
    category,
    salary,
    jobType,
    salaryPeriod,
    currency,
    setTitle,
    setSalary,
    setSalaryPeriod,
    setCurrency,
    setCategory,
    setJobType,
  } = useCreateJob();
  const {
    editTitle,
    editCategory,
    editSalary,
    editJobType,
    editSalaryPeriod,
    editCurrency,
    setEditTitle,
    setEditSalary,
    setEditSalaryPeriod,
    setEditCurrency,
    setEditCategory,
    setEditJobType,
  } = useEditJob();

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
            {JOB_CATEGORIES.map((cat) => (
              <SelectItem
                key={cat.value}
                value={cat.value}
                className="p-4 text-lg"
              >
                {cat.label}
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
            {JOB_TYPES.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="p-4 text-lg"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
              {salaryPeriods.map((period) => (
                <SelectItem
                  key={period.value}
                  value={period.value}
                  className="text-lg p-4"
                >
                  {period.label}
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
                  key={cur.value}
                  value={cur.value}
                  className="text-lg p-4"
                >
                  {cur.label}
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
