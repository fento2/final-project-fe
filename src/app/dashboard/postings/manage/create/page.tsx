"use client";
import { apiCall } from "@/helper/apiCall";
import CardJobPosting from "../components/CardFormJob";
import { useGeneralDataStore } from "@/lib/zustand/generalData";
import { useEffect } from "react";


const CreateNewJobPage = () => {
  const { setCategories, setCurrencies, setJobTypes, setPeriodSalary } = useGeneralDataStore()

  const getGenralData = async () => {
    try {
      const { data } = await apiCall.get('postings/get-general-data')
      if (data.success) {
        setCategories(data.data.categories)
        setCurrencies(data.data.currencies)
        setJobTypes(data.data.jobTypes)
        setPeriodSalary(data.data.periodSalary)
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getGenralData()
  }, [])
  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black tracking-wider">
          Create Job Posting
        </h3>
        <span className="text-sm text-gray-600">Fill in the job details</span>
      </div>
      <CardJobPosting />
    </div>

  );
};

export default CreateNewJobPage;
