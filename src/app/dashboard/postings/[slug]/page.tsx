"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import FormPreselectionTest from "./components/FormPreSelection";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { usePreselectionStore } from "@/lib/zustand/preselectionStore";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailPostingWithApplicant from "./components/DetailJobPosting";

const DetailPostings = () => {
  const params = useParams();
  const { slug } = params;
  const { showForm, setShowForm } = usePreselectionStore()
  const [sortOption, setSortOption] = useState("appliedAt"); // appliedAt / status
  const [sortDirection, setSortDirection] = useState("desc"); // asc / desc
  const [filterStatus, setFilterStatus] = useState("all"); // all / Pending / Accepted / Rejected

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
      name: "Andi Wijaya",
      email: "andi@example.com",
      appliedAt: "2025-08-20",
      status: "Pending",
      cvUrl: "/dummy-cv/andi.pdf",
      score: 70,
    },
    {
      name: "Budi Santoso",
      email: "budi@example.com",
      appliedAt: "2025-08-22",
      status: "Reviewed",
      cvUrl: "/dummy-cv/budi.pdf",
      score: 80,
    },
    {
      name: "Citra Dewi",
      email: "citra@example.com",
      appliedAt: "2025-08-25",
      status: "Interview Scheduled",
      cvUrl: "/dummy-cv/citra.pdf",
      score: 90,
    },
    {
      name: "Andi Wijaya",
      email: "andi@example.com",
      appliedAt: "2025-08-20",
      status: "Pending",
      cvUrl: "/dummy-cv/andi.pdf",
      score: 70,
    },
    {
      name: "Budi Santoso",
      email: "budi@example.com",
      appliedAt: "2025-08-22",
      status: "Reviewed",
      cvUrl: "/dummy-cv/budi.pdf",
      score: 80,
    },
    {
      name: "Citra Dewi",
      email: "citra@example.com",
      appliedAt: "2025-08-25",
      status: "Interview Scheduled",
      cvUrl: "/dummy-cv/citra.pdf",
      score: 90,
    },
  ];

  const filteredApplicants = applicants.filter((app) =>
    filterStatus === "all" ? true : app.status === filterStatus
  );

  const statusOrder: Record<string, number> = {
    Pending: 1,
    Accepted: 2,
    Rejected: 3,
  };

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    let compare = 0;
    if (sortOption === "appliedAt") {
      compare =
        new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
    } else if (sortOption === "status") {
      compare = statusOrder[a.status] - statusOrder[b.status];
    } else if (sortOption === "score") {
      compare = a.score - b.score;
    }
    return sortDirection === "asc" ? compare : -compare;
  });

  const {
    questions,
    setQuestions,
    updateQuestion,
    minScore,
    setMinScore,
    resetQuestions,
  } = usePreselectionStore();

  return (
    <div className="space-y-6 container mx-auto md:px-20 px-8 my-8 ">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <DetailPostingWithApplicant />
        {/* preselectiontest */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowForm(false)}
          >
            <Card
              className=" w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-6xl mx-4 relative max-h-[600px] overflow-y-auto sm:max-h-[700px] md:max-h-[800px] lg:max-h-none lg:overflow-visible scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tombol close X */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                <X />
              </button>

              <CardContent className="space-y-4 p-4 sm:p-6">
                {/* Form Preselection + upload file */}
                <FormPreselectionTest
                  questions={questions}
                  setQuestions={setQuestions}
                  minScore={minScore}
                  setMinScore={setMinScore} />

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Upload the test questions in Excel format (.xlsx or .xls) or enter
                    them manually below.
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    className="w-full sm:w-64 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

        )}

        <Card className="lg:col-span-1 order-3 lg:order-2 ">
          <CardHeader className="flex flex-col gap-4 items-center">
            {/* Judul di tengah */}
            <CardTitle className="text-center">
              Applicants ({filteredApplicants.length})
            </CardTitle>

            {/* Bar filter + sort + toggle di bawah judul */}
            <div className="flex justify-between items-center w-full">
              {/* Kanan: Filter Status + Sort Option */}
              <div className="flex gap-2">
                {/* Filter Status */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Option */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appliedAt">Applied Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Kiri: Toggle Asc / Desc */}
              <Button
                variant="outline"
                onClick={() =>
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortDirection === "asc" ? "Asc ↑" : "Desc ↓"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="overflow-y-auto max-h-[650px] scrollbar-hide">
            <div className="space-y-4">
              {sortedApplicants.map((app, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow"
                >
                  {/* Info Pelamar */}
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                    <p className="text-sm">
                      Status: <span className="font-medium">{app.status}</span>
                    </p>
                    <p className="text-sm">
                      Score: <span className="font-medium">{app.score}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Applied on {app.appliedAt}
                    </p>
                  </div>

                  {/* Aksi */}
                  <div className="flex gap-2 flex-wrap md:flex-col">
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
    </div >
  );
};

export default DetailPostings;
