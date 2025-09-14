import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    CheckCircle2,
    MapPin,
    DollarSign,
    Timer,
    Building2,
    Mail,
    Phone,
    CalendarDays,
    Users,
    Share2,
    Bookmark,
    Star,
} from "lucide-react";
import { apiCall } from "../../../../helper/apiCall";
import { Company as DatabaseCompany } from "../../../../types/database";

type Job = {
    id: string;
    title: string;
    type: string;
    bullets: string[];
    location: string;
    salary: string;
    slug: string;
};

type Company = {
    slug: string;
    name: string;
    coverImage: string;
    logo: string;
    verified: boolean;
    meta: {
        location: string;
        salaryRange: string;
        hiringTime: string;
    };
    description: string;
    culture: string;
    benefits: string[];
    about: {
        industry: string;
        size: string;
        founded: string;
    };
    contacts: {
        phone: string;
        email: string;
        location: string;
    };
    stats: {
        joined: string;
        lastActive: string;
        openJobs: number;
    };
    jobs: Job[];
};

// Function to fetch company data from backend
async function fetchCompanyFromBackend(slug: string): Promise<Company | null> {
    try {
        const { data } = await apiCall.get('/company');
        const companiesData = data?.data?.data || data?.data || data?.companies || data || [];
        
        if (Array.isArray(companiesData)) {
            const company = companiesData.find((c: DatabaseCompany) => {
                const companySlug = c.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                return companySlug === slug;
            });
            
            if (company) {
                // Transform backend company to frontend format
                return {
                    slug: slug,
                    name: company.name,
                    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1974&auto=format&fit=crop",
                    logo: company.profile_picture || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=faces",
                    verified: true,
                    meta: {
                        location: "Remote",
                        salaryRange: "50,000 - 120,000 per year",
                        hiringTime: "Average 1-2 weeks",
                    },
                    description: company.description || "A leading company in their industry",
                    culture: "We value teamwork, collaboration, and innovation. Our employees are encouraged to think creatively and work together to find the best solutions for our clients.",
                    benefits: [
                        "Competitive salary and benefits package",
                        "Comprehensive health and dental insurance",
                        "401(k) retirement plan with company match",
                        "Paid time off and flexible work hours",
                        "Professional development and training opportunities",
                        "Employee recognition and awards programs",
                    ],
                    about: {
                        industry: "Technology",
                        size: "100-500 employees",
                        founded: "2010",
                    },
                    contacts: {
                        phone: "123 456 7890",
                        email: "contact@company.com",
                        location: "Remote",
                    },
                    stats: {
                        joined: "Joined 2022",
                        lastActive: "Last activity 2 days ago",
                        openJobs: Math.floor(Math.random() * 30) + 1,
                    },
                    jobs: [
                        {
                            id: "1",
                            title: "Senior Developer",
                            type: "Full Time",
                            bullets: [
                                "Bachelor's degree in Computer Science or related",
                                "5+ years of experience in software development",
                                "Proficiency in modern web technologies",
                            ],
                            location: "Remote",
                            salary: "80,000 - 120,000 per year",
                            slug: "senior-developer",
                        },
                        {
                            id: "2",
                            title: "UI/UX Designer",
                            type: "Full Time",
                            bullets: [
                                "Bachelor's degree in design or related",
                                "3+ years of experience in UX/UI design",
                                "Experience with design systems",
                            ],
                            location: "Remote",
                            salary: "60,000 - 90,000 per year",
                            slug: "uiux-designer",
                        },
                    ],
                };
            }
        }
    } catch (error) {
        console.error('Error fetching company from backend:', error);
    }
    return null;
}

const COMPANIES: Record<string, Company> = {
    "acme-corporation": {
        slug: "acme-corporation",
        name: "Acme Corporation",
        coverImage:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1974&auto=format&fit=crop",
        logo:
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=faces",
        verified: true,
        meta: {
            location: "New York, NY",
            salaryRange: "80,000 - 100,000 per year",
            hiringTime: "Average 1-2 weeks",
        },
        description:
            "BrightLight Solutions is a leading provider of enterprise-level technology solutions for businesses of all sizes. We specialize in cloud computing, data analytics, and cybersecurity services. Our team of experienced professionals is dedicated to delivering high-quality solutions that exceed our clients' expectations.",
        culture:
            "At BrightLight Solutions, we value teamwork, collaboration, and innovation. Our employees are encouraged to think creatively and work together to find the best solutions for our clients. We are committed to creating a positive and inclusive work environment where everyone feels valued and respected.",
        benefits: [
            "Competitive salary and benefits package",
            "Comprehensive health and dental insurance",
            "401(k) retirement plan with company match",
            "Paid time off and flexible work hours",
            "Professional development and training opportunities",
            "Employee recognition and awards programs",
        ],
        about: {
            industry: "Information Technology & Security",
            size: "500-700 employees",
            founded: "2008",
        },
        contacts: {
            phone: "123 456 7890",
            email: "support@acmecorp.com",
            location: "123 Anywhere Street, New York, NYC, USA",
        },
        stats: {
            joined: "Joined April 2022",
            lastActive: "Last activity 2 days ago",
            openJobs: 20,
        },
        jobs: [
            {
                id: "1",
                title: "Senior UI Designer",
                type: "Full Time",
                bullets: [
                    "Bachelor's degree in design or related",
                    "5+ years of experience in UI design",
                    "Proficiency in Adobe Creative Suite",
                ],
                location: "New York, NY",
                salary: "80,000 - 100,000 per year",
                slug: "senior-ui-designer",
            },
            {
                id: "2",
                title: "UI/UX Designer",
                type: "Full Time",
                bullets: [
                    "Bachelor's degree in design or related",
                    "3+ years of experience in UX/UI design",
                    "Experience with design systems",
                ],
                location: "New York, NY",
                salary: "80,000 - 100,000 per year",
                slug: "uiux-designer",
            },
            {
                id: "3",
                title: "Mobile UI Designer",
                type: "Full Time",
                bullets: [
                    "Bachelor's degree in design or related",
                    "2+ years of experience in UI/UX design",
                    "Familiar with mobile design guidelines",
                ],
                location: "New York, NY",
                salary: "80,000 - 100,000 per year",
                slug: "mobile-ui-designer",
            },
            {
                id: "4",
                title: "Lead UI/UX Designer",
                type: "Full Time",
                bullets: [
                    "Bachelor's degree in design or related",
                    "7+ years of experience in UX/UI design",
                    "Experience leading design teams",
                ],
                location: "New York, NY",
                salary: "80,000 - 100,000 per year",
                slug: "lead-uiux-designer",
            },
        ],
    },
};

export default async function CompanyDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    
    // First, try to get company from static data
    let company: Company | null = COMPANIES[slug] || null;
    
    // If not found in static data, try to fetch from backend
    if (!company) {
        company = await fetchCompanyFromBackend(slug);
    }
    
    // If still not found, return 404
    if (!company) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 pt-6 text-sm text-gray-500">
                <nav className="flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                    <span>/</span>
                    <Link href="/jobs" className="hover:text-gray-700">Jobs</Link>
                    <span>/</span>
                    <Link href="/jobs/companies" className="hover:text-gray-700">Companies</Link>
                    <span>/</span>
                    <span className="text-gray-900">{company.name}</span>
                </nav>
            </div>

            {/* Header */}
            <header className="mt-4 border-b">
                <div className="relative max-w-7xl mx-auto px-6">
                    {/* Cover Image */}
                    <div className="relative h-56 w-full rounded-2xl overflow-hidden">
                        <Image src={company.coverImage} alt={company.name} fill className="object-cover" />
                        <div className="absolute top-6 right-6">
                            <div className="bg-indigo-600 text-white px-3 py-2 rounded-full text-xs font-semibold shadow">
                                WE ARE HIRING
                            </div>
                        </div>
                    </div>

                    {/* Company Logo - Outside Card */}
                    <div className="flex items-start gap-6 pt-6 pb-6">
                        <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Image src={company.logo} alt={`${company.name} logo`} width={96} height={96} className="object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{company.name}</h1>
                                    {company.verified && (
                                        <CheckCircle2 className="text-indigo-600" />
                                    )}
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                                    <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                        {company.stats.openJobs} Jobs Open - Available
                                    </span>
                                    <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <MapPin className="w-4 h-4" /> {company.meta.location}
                                    </span>
                                    <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <DollarSign className="w-4 h-4" /> {company.meta.salaryRange}
                                    </span>
                                    <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                        <Timer className="w-4 h-4" /> {company.meta.hiringTime}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-start md:self-auto">
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                    Contact This Company
                                </button>
                                <button className="p-2.5 rounded-xl border hover:bg-gray-50">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 rounded-xl border hover:bg-gray-50">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left content */}
                <div className="lg:col-span-2">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Company Description</h2>
                        <p className="text-gray-600 leading-relaxed">{company.description}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Company Culture</h2>
                        <p className="text-gray-600 leading-relaxed">{company.culture}</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Benefits</h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            {company.benefits.map((b) => (
                                <li key={b}>{b}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Openings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {company.jobs.map((job) => (
                                <article
                                    key={job.id}
                                    className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                            {job.title}
                                        </h3>
                                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                                            {job.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                        <Building2 className="w-4 h-4" /> {company.name}
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                        {job.bullets.map((it) => (
                                            <li key={it} className="flex items-start gap-2">
                                                <Star className="w-4 h-4 text-indigo-500 mt-0.5" />
                                                <span>{it}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> {job.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" /> {job.salary}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/jobs/${job.slug}`}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                                        >
                                            Apply This Job
                                        </Link>
                                        <button className="p-2 rounded-xl border hover:bg-gray-50">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-start gap-3">
                                <Building2 className="w-4 h-4 text-indigo-600 mt-1" />
                                <div>
                                    <p className="text-gray-500">Primary Industry:</p>
                                    <p className="font-medium">{company.about.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="w-4 h-4 text-indigo-600 mt-1" />
                                <div>
                                    <p className="text-gray-500">Company Size:</p>
                                    <p className="font-medium">{company.about.size}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CalendarDays className="w-4 h-4 text-indigo-600 mt-1" />
                                <div>
                                    <p className="text-gray-500">Founded in:</p>
                                    <p className="font-medium">{company.about.founded}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 text-sm text-gray-700">
                            <h4 className="text-base font-semibold text-gray-900 mb-2">Contacts</h4>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-indigo-600" />
                                <span>{company.contacts.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-indigo-600" />
                                <span>{company.contacts.email}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-indigo-600 mt-1" />
                                <span>{company.contacts.location}</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full border rounded-xl py-2.5 font-semibold hover:bg-gray-50">
                            Write Review About Company
                        </button>

                        <div className="mt-6 text-xs text-gray-500">
                            <p>{company.stats.joined}</p>
                            <p>{company.stats.lastActive}</p>
                        </div>
                    </div>
                </aside>
            </main>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 pb-14">
                <div className="bg-indigo-950 text-indigo-50 rounded-3xl p-8 md:p-12">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        Join Horizon Jobs today and take the first step towards finding your dream job!
                    </h3>
                    <p className="text-indigo-200 mb-6 max-w-3xl">
                        With our user-friendly platform and up-to-date job listings, you\'ll be on your way to a fulfilling career in no time. Sign up now and see what opportunities await!
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700"
                    >
                        Join Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
