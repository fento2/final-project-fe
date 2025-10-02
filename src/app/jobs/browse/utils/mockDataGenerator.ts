import { Job as BackendJob } from "@/types/database";

// Mock data generator for demonstration when backend is unavailable
export const generateMockJobs = (): BackendJob[] => {
    const companies = [
        { name: "TechCorp Indonesia", logo: "/images/logo.png" },
        { name: "DataScience Solutions", logo: "/images/logo.png" },
        { name: "DevStudio Jakarta", logo: "/images/logo.png" },
        { name: "CloudTech Asia", logo: "/images/logo.png" },
        { name: "AI Innovation Labs", logo: "/images/logo.png" },
        { name: "WebFlow Indonesia", logo: "/images/logo.png" },
        { name: "Mobile Apps Nusantara", logo: "/images/logo.png" },
        { name: "StartupHub Jakarta", logo: "/images/logo.png" },
        { name: "BigData Corporation", logo: "/images/logo.png" },
        { name: "Digital Innovation", logo: "/images/logo.png" },
        { name: "Tech Startup Indo", logo: "/images/logo.png" },
        { name: "Software House JKT", logo: "/images/logo.png" },
        { name: "Fintech Indonesia", logo: "/images/logo.png" },
        { name: "E-commerce Tech", logo: "/images/logo.png" },
        { name: "Gaming Studio ID", logo: "/images/logo.png" },
    ];

    const jobTitles = [
        "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "Data Scientist", "Product Manager", "UI/UX Designer",
        "DevOps Engineer", "Mobile Developer", "QA Engineer",
        "Marketing Manager", "Business Analyst", "Project Manager",
        "Machine Learning Engineer", "Software Architect", "Database Administrator",
        "React Developer", "Node.js Developer", "Python Developer",
        "Java Developer", "iOS Developer", "Android Developer",
        "Digital Marketing Specialist", "Content Creator", "SEO Specialist",
        "Graphic Designer", "Motion Graphics Designer", "3D Artist"
    ];

    const locations = [
        "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Utara", "Jakarta Timur",
        "Bandung", "Surabaya", "Yogyakarta", "Medan", "Semarang", 
        "Malang", "Denpasar", "Tangerang", "Depok", "Bekasi",
        "Bogor", "Makassar", "Palembang", "Batam", "Balikpapan"
    ];

    const jobTypes: any[] = ["Full Time", "Part-time", "Contract", "Remote", "Hybrid"];
    const categories = ["Technology", "Marketing", "Design", "Data Science", "Management", "Finance", "Sales", "Operations"];

    return Array.from({ length: 45 }, (_, index) => {
        const company = companies[index % companies.length];
        const baseId = 1000 + index;
        const title = jobTitles[index % jobTitles.length];
        const location = locations[index % locations.length];
        const jobType = jobTypes[index % jobTypes.length];
        const category = categories[index % categories.length];
        
        const salaryMin = Math.floor(Math.random() * 5000000) + 3000000;
        const salaryMax = salaryMin + Math.floor(Math.random() * 5000000) + 2000000;

        return {
            job_id: baseId,
            id: baseId,
            title,
            slug: `${title.toLowerCase().replace(/\s+/g, '-')}-${baseId}`,
            description: `We are looking for a talented ${title} to join our team. This is an exciting opportunity to work with cutting-edge technology and contribute to innovative projects.`,
            category,
            location,
            salary: salaryMin,
            salaryMax,
            periodSalary: "monthly",
            currency: "IDR",
            job_type: jobType,
            expiredAt: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            Company: {
                company_id: index % companies.length + 1,
                id: index % companies.length + 1,
                name: company.name,
                logo: company.logo,
                slug: company.name.toLowerCase().replace(/\s+/g, '-'),
                description: `${company.name} is a leading technology company focused on innovation and growth.`,
                website: `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
                location: location,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            Skills: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, skillIndex) => ({
                skill_id: skillIndex + 1,
                id: skillIndex + 1,
                name: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker"][skillIndex % 8],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }))
        } as BackendJob;
    });
};