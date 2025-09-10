"use client";
import { apiCall } from "@/helper/apiCall";
import CardJobPosting from "../../components/CardFormJob";
import { useEffect } from "react";
import { useGeneralDataStore } from "@/lib/zustand/generalData";
import { getDetailForEditFetch } from "@/fetch/postings.fetch";
import { useEditJobStore } from "@/lib/zustand/editJobStore";
import { useParams } from "next/navigation";

const EditPosting = () => {
  const { setCategories, setCurrencies, setJobTypes, setPeriodSalary } = useGeneralDataStore()
  const { slug } = useParams()
  const { reset } = useEditJobStore()
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
    reset();
    const getDetailEdit = async () => {
      await getDetailForEditFetch(useEditJobStore, slug as string)
    }
    getDetailEdit()
    getGenralData()
  }, [slug])
  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black tracking-wider">
          Edit Job Posting
        </h3>
        <span className="text-sm text-gray-600">Fill in the job details</span>
      </div>
      <CardJobPosting />
    </div>
  );
};
export default EditPosting;
