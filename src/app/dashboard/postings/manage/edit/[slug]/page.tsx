"use client";
import CardJobPosting from "../../components/CardFormJob";

const EditPosting = () => {
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
