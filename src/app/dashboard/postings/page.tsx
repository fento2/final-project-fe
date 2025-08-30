"use client";
import { useState } from "react";
import CreateJob from "./componetns/CreateJob";
import PreselectionTest from "./componetns/CreatePreSelection";

const JobPostings = () => {
  const [next, setNext] = useState(false);
  return (
    <div className="container md:pl-20 mx-auto min-h-screen px-4 py-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black tracking-wider">
          Create Job Posting
        </h3>
        <span className="text-sm text-gray-600">Fill in the job details</span>
      </div>
      {next ? <PreselectionTest /> : <CreateJob setNext={setNext} />}
    </div>
  );
};

export default JobPostings;
