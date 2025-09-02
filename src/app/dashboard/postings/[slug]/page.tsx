"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Edit2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ManagePosting from "./components/ManagePostings";
import { useParams } from "next/navigation";
import FormPreselectionTest from "../manage/components/FormPreSelection";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCreatePreselectionStore } from "@/lib/zustand/preselectionStore";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const DetailPostings = () => {
  const params = useParams();
  const { slug } = params;
  const [addPreselection, setAddPreselection] = useState(true);

  const { setQuestions: setQuestions } = useCreatePreselectionStore();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // | Question       | OptionA | OptionB | OptionC | OptionD | Answer |
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const parsedQuestions = (jsonData as any[]).map((row) => ({
        question: row["Question"] || "",
        options: [
          row["Option A"] || "",
          row["Option B"] || "",
          row["Option C"] || "",
          row["Option D"] || "",
        ].filter(Boolean),
        answer: row["Answer"], // misalnya "A", "B", "C", "D"
      }));

      setQuestions(parsedQuestions); // simpan ke zustand
    };
    reader.readAsArrayBuffer(file);
  };
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
    skill: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "TailwindCSS",
      "Node.js",
    ],
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
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        {/* Job Detail */}
        <Card className="relative lg:col-span-2 border border-gray-200 shadow-sm rounded-lg order-1">
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
                <p className="text-md font-bold">Category</p>
                <p className="text-base">{job.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-md font-bold">Location</p>
                <p className="text-base">{job.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-md font-bold">Salary</p>
                <p className="text-base">{job.salary}</p>
              </div>
              <div className="space-y-1">
                <p className="text-md font-bold">Type</p>
                <p className="text-base">{job.jobType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-md font-bold">Posted</p>
                <p className="text-base">{job.createdAt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-md font-bold">Expires</p>
                <p className="text-base">{job.expiredAt}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h2 className="text-lg font-bold tracking-wide mb-2">
                Description
              </h2>
              <div
                className="quill-preview"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Tags / Skills */}
            {job.skill && job.skill.length > 0 && (
              <div className="-mt-10">
                <h2 className="text-lg font-semibold tracking-wide mb-2">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skill.map((s: string, i: number) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-indigo-500/30 text-indigo-700"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center space-x-4">
                <Label className="text-lg">Add Preselection Test</Label>
                <Switch
                  checked={addPreselection}
                  onCheckedChange={setAddPreselection}
                  className="bg-gray-200 data-[state=checked]:bg-indigo-500 relative rounded-full transition-colors"
                >
                  <span
                    className={`${
                      addPreselection ? "translate-x-6" : "translate-x-0"
                    } inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform`}
                  />
                </Switch>
              </div>

              {addPreselection && (
                <div className="space-y-2 mt-2">
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    className="w-64 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload the test questions in Excel format (.xlsx or .xls)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <ManagePosting slug={slug as string} />
        </Card>

        {/* preselectiontest */}

        {addPreselection && (
          <Card className="lg:col-span-3 order-2 lg:order-3">
            <CardContent>
              <FormPreselectionTest />
            </CardContent>
          </Card>
        )}
        {/* Applicants */}
        <Card className="lg:col-span-1 order-3 lg:order-2">
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
                  <div className="gap-2 flex flex-col">
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
