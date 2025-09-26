"use client";
import { apiCall } from "@/helper/apiCall";
import CardJobPosting from "../../components/CardFormJob";
import { useEffect, useState } from "react";
import { useGeneralDataStore } from "@/lib/zustand/generalData";
import { getDetailForEditFetch } from "@/fetch/postings.fetch";
import { useEditJobStore } from "@/lib/zustand/editJobStore";
import { useParams } from "next/navigation";
import { useAuthRole } from "@/helper/authRole";

const EditPosting = () => {
  useAuthRole('COMPANY')
  const { setCategories, setCurrencies, setJobTypes, setPeriodSalary } = useGeneralDataStore()
  const { slug } = useParams()
  const { reset } = useEditJobStore()
  const [loading, setLoading] = useState(false)
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
      await getDetailForEditFetch(useEditJobStore, slug as string, setLoading)
    }
    getDetailEdit()
    getGenralData()
  }, [slug])
  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6 overflow-x-hidden">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black tracking-wider">
          Edit Job Posting
        </h3>
        <span className="text-sm text-gray-600">Fill in the job details</span>
      </div>
      {loading ? (
        // Skeleton Card Placeholder
        <div className="border border-gray-200 shadow-md rounded-xl bg-white p-6 animate-pulse ">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div> {/* title */}
          <div className="h-4 bg-gray-200 rounded w-1/2"></div> {/* subtitle */}
          <div className="h-6 bg-gray-200 rounded w-full mt-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6 mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6 mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6 mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6 mt-2"></div>
          <div className="h-10 bg-gray-300 rounded w-32 mt-4"></div> {/* button placeholder */}
        </div>
      ) : (
        <CardJobPosting />
      )}
    </div>
  );
};
export default EditPosting;
