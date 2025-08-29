// app/jobs/[id]/page.tsx (Next.js 13+ dengan App Router)
import { Briefcase, MapPin, Calendar, Bookmark, Share2, GraduationCap, Layers, Banknote, User } from "lucide-react";

export default function JobDetailPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
                <ol className="flex space-x-2">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li>/</li>
                    <li><a href="/jobs" className="hover:underline">Jobs</a></li>
                    <li>/</li>
                    <li className="text-blue-600 font-semibold">Information Technology</li>
                </ol>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left Info */}
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Front-End Web Developer</h1>
                    <div className="flex items-center space-x-2 mb-4">
                        <img src="/company-logo.png" alt="Company" className="w-14 h-14 rounded bg-gray-100" />
                        <div>
                            <h2 className="text-lg font-semibold flex items-center">
                                UXLabs Company <span className="ml-1 text-blue-500">✔</span>
                            </h2>
                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>Chicago, IL</span>
                                <span>•</span>
                                <span>$100,000 - 130,000 per year</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 rounded-full">Information Technology</span>
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 rounded-full">Full Time</span>
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 rounded-full">Urgently Needed</span>
                    </div>

                    {/* Job Description */}
                    <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        UXLabs Company is seeking an experienced Front-End Web Developer to join our team. In this role,
                        you will be responsible for developing and implementing user interfaces for web applications
                        using HTML, CSS, and JavaScript. You will work closely with the design and development teams
                        to create visually appealing and user-friendly web pages that meet our clients’ needs.
                    </p>

                    {/* Job Requirements */}
                    <h3 className="text-xl font-semibold mb-2">Job Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
                        <li>Bachelor’s degree in Computer Science, Web Development or related field</li>
                        <li>3+ years of experience in web development</li>
                        <li>Strong knowledge of front-end development languages and frameworks, including HTML, CSS, and JavaScript</li>
                        <li>Experience with responsive design and mobile-first development</li>
                        <li>Experience with version control systems, such as Git</li>
                        <li>Understanding of web performance optimization techniques</li>
                        <li>Strong problem-solving and analytical skills</li>
                        <li>Ability to work collaboratively in a team environment</li>
                    </ul>

                    {/* Company Overview */}
                    <div className="bg-white rounded-xl shadow p-6">
                        {/* Baris 1: Logo dan Nama Company */}
                        <div className="flex items-center gap-4 mb-6">
                            <img src="/company-logo.png" alt="Company" className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
                            <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                UXLabs Company
                            </h4>
                        </div>

                        {/* Baris 2: Info 2 kolom dan deskripsi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Average 1-2 weeks</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>Chicago, IL</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Banknote className="w-4 h-4 text-gray-400" />
                                    <span>$100,000 - 130,000 per year</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>50-100 employees</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-gray-400" />
                                    <span>Web Design & Development</span>
                                </div>
                            </div>
                        </div>

                        <h5 className="font-semibold text-sm text-slate-900 mb-1">Company Overview</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            UXLabs Company is a full-service web design and development company located in Chicago, Illinois.
                            We specialize in creating visually stunning, user-friendly websites for businesses of all sizes.
                            Lets work with us for better future.
                        </p>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-white border rounded-xl p-5 shadow-sm sticky top-6">
                        <p className="text-sm text-gray-500 mb-2">Posted February 10, 2023</p>
                        <p className="text-sm text-gray-500 mb-4">Last activity 5 days ago</p>
                        <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">
                            Apply This Job
                        </button>
                        <div className="flex justify-center gap-3 mt-4">
                            <button className="p-2 border rounded-lg hover:bg-gray-100"><Bookmark className="w-5 h-5" /></button>
                            <button className="p-2 border rounded-lg hover:bg-gray-100"><Share2 className="w-5 h-5" /></button>
                        </div>

                        <h3 className="text-lg font-semibold mt-6 mb-4">Job Overview</h3>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600" /> Career Level: Mid-Level</li>
                            <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-600" /> Qualification: Bachelor’s degree in CS, Web Development</li>
                            <li className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-600" /> Experience: 3+ years</li>
                            <li className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Job Closed in: May 9, 2023</li>
                        </ul>

                        <h3 className="text-lg font-semibold mt-6 mb-3">Skills Specialization:</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">Web Development</span>
                            <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">User Interface Design</span>
                            <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">Front-End Development</span>
                            <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">HTML</span>
                            <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">CSS</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
