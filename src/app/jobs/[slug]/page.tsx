// app/jobs/[id]/page.tsx (Next.js 13+ dengan App Router)
import { Briefcase, MapPin, Calendar, Bookmark, Share2, GraduationCap, Layers, Banknote, User, Hourglass, Check, CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface JobDetailPageProps {
    params: { slug: string };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { slug } = await params;
    const jobTitle = decodeURIComponent(slug).replace(/-/g, "/");

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
                <ol className="flex space-x-2">
                    <li>
                        <Link href="/" className="hover:underline">Home</Link>
                    </li>
                    <li>/</li>
                    <li>
                        <Link href="/jobs" className="hover:underline">Jobs</Link>
                    </li>
                    <li>/</li>
                    {/* <li className="text-blue-600 font-semibold">Information Technology</li> */}
                    <li className="text-blue-600 font-semibold">{jobTitle}</li>
                </ol>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{jobTitle}</h1>
                <Image
                    src="https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Company"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded bg-gray-100"
                />
            </nav>

            <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left Info */}
                <div className="flex-1">
                    <div className="mb-6">
                        {/* Baris 1: Nama company dan badge */}
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center">
                                UXLabs Company
                            </h2>
                            <CircleCheck fill="blue" color="white" className="min-w-4 min-h-4" />
                        </div>
                        {/* Baris 2: lokasi dan gaji */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-3">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>Chicago, IL</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Banknote className="w-4 h-4" />
                                <span>$100,000 - 130,000 per year</span>
                            </div>
                        </div>
                        {/* Baris 3: tags */}
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md">Information Technology</span>
                            <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md">Full Time</span>
                            <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md">Urgently Needed</span>
                        </div>
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
                            <Image
                                src="https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Company"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0"
                            />
                            <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                UXLabs Company
                            </h4>
                            <CircleCheck fill="blue" color="white" className="min-w-4 min-h-4" />
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
                    {/* Atas: tanggal & tombol */}
                    <div className="flex flex-col items-stretch gap-2 mb-4">
                        <p className="text-sm text-gray-500 text-right">Posted February 10, 2023</p>
                        <p className="text-sm text-gray-500 text-right mb-2">Last activity 3 days ago</p>
                        <div className="flex gap-2 mb-4">
                            <button className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition">
                                Apply This Job
                            </button>
                            <button className="w-10 h-10 border border-indigo-200 rounded-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition">
                                <Bookmark className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 border border-indigo-200 rounded-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Card Job Overview */}
                    <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow mt-4">
                        <h3 className="text-xl font-bold mb-5 text-slate-900">Job Overview</h3>
                        <ul className="space-y-5 text-sm text-gray-700 mb-6">
                            <li className="flex items-start gap-3">
                                <Briefcase className="w-6 h-6 text-indigo-500 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-slate-900">Career Level:</span>
                                    <div>Mid-Level</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <GraduationCap className="min-w-6 h-6 text-indigo-500 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-slate-900">Qualification:</span>
                                    <div>Bachelor's degree in Computer Science, Web Development or related field</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Calendar className="min-w-6 h-6 text-indigo-500 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-slate-900">Years of Experience:</span>
                                    <div>3+ years of experience in Web Development</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Hourglass className="w-6 h-6 text-indigo-500 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-slate-900">Job Closed in:</span>
                                    <div>May 9, 2023</div>
                                </div>
                            </li>
                        </ul>
                        <div>
                            <div className="font-semibold text-slate-900 text-sm mb-2">Skills Specialization:</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">Web Development</span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">User Interface Design</span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">Front-End Development</span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">HTML</span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">CSS</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
