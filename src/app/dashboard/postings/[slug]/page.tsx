"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PrintTextEditor from "./components/PrintTextEditor";
import { Edit2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const DetailPostings = () => {
  // dummy job detail
  const job = {
    title: "Frontend Developer",
    company: "Tech Corp",
    category: "Software Development",
    location: "Jakarta, Indonesia",
    salary: "Rp 10.000.000 - Rp 15.000.000",
    jobType: "Full-Time",
    createdAt: "2025-08-15",
    expiredAt: "2025-09-15",
    description:
      '<p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">As a full stack engineer, you will be responsible for the development and launch of product features. Your role will need to be a combination of team player and individual contributor who has production experience delivering front-end and back-end software at scale. </span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Requirements :</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Candidate must possess at least Bachelor\'s Degree in Engineering (Computer/Telecommunication) or equivalent.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">3-5 years of full stack development experience and very good at problem solving, bug fixing, helping team to solve problems.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Experience in components at each layer of modern web applications.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Experience in JavaScript frameworks (e.g Vue.js &amp; Node.js) is a must.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Experience in both front-end and back-end aspects.</span></li></ol><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Job Descriptions :</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Design and implementation of low-latency, high-availability, and performance-oriented applications for Sociolla platform.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Develop, build, test, deploy modules.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Continuously discover, evaluate, and implement new technologies to maximize development efficiency.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="color: rgba(0, 0, 0, 0.9); background-color: rgba(0, 0, 0, 0);">Ensure the performance, quality, and responsiveness of the application.</span></li></ol><p><br></p><p><br></p>',
  };

  // dummy applicants
  const applicants = [
    {
      id: 1,
      name: "Andi Wijaya",
      email: "andi@example.com",
      appliedAt: "2025-08-20",
      status: "Pending",
      cvUrl: "/dummy-cv/andi.pdf",
    },
    {
      id: 2,
      name: "Budi Santoso",
      email: "budi@example.com",
      appliedAt: "2025-08-22",
      status: "Reviewed",
      cvUrl: "/dummy-cv/budi.pdf",
    },
    {
      id: 3,
      name: "Citra Dewi",
      email: "citra@example.com",
      appliedAt: "2025-08-25",
      status: "Interview Scheduled",
      cvUrl: "/dummy-cv/citra.pdf",
    },
  ];

  return (
    <div className="space-y-6 container mx-auto md:px-20 px-8 my-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Job Detail */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold">
              {job.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Category</p>
                <p className="text-base">{job.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <p className="text-base">{job.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Salary</p>
                <p className="text-base">{job.salary}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Type</p>
                <p className="text-base">{job.jobType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Posted</p>
                <p className="text-base">{job.createdAt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Expires</p>
                <p className="text-base">{job.expiredAt}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold tracking-wide mb-2">
                Description
              </h2>
              <PrintTextEditor value={job.description} />
            </div>
          </CardContent>
        </Card>

        {/* Applicants */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Applicants ({applicants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicants.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {app.email} • Applied on {app.appliedAt}
                    </p>
                    <p>Status: {app.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <FileText size={16} /> CV
                      </a>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPostings;
