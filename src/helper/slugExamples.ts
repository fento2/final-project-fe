// Example of how the new slug generation works
import { generateJobSlug } from './slugHelper';

// Example jobs to demonstrate slug generation
const exampleJobs = [
    {
        title: "Data Scientist - Data Science - Full Time",
        Company: { name: "Digital Nusantara" },
        job_id: "1758305570483",
        slug: "data-scientist-data-science-full-time-digital-nusantara-1758305570483" // Old long slug
    },
    {
        title: "Velit qui mollit sun DataScience FullTime",
        Company: { name: "HorizonJobWeb" },
        job_id: "123456"
    },
    {
        title: "Senior Software Engineer with React and Node.js Experience",
        Company: { name: "TechCorp Inc" },
        job_id: "789"
    }
];

// Test the slug generation
console.log('=== Slug Generation Test ===');
exampleJobs.forEach((job, index) => {
    const oldSlug = job.slug || 'no-existing-slug';
    const newSlug = generateJobSlug(job, true); // Force clean generation
    console.log(`\nJob ${index + 1}:`);
    console.log(`Title: ${job.title}`);
    console.log(`Old slug: ${oldSlug}`);
    console.log(`New slug: ${newSlug}`);
});

// Expected new slugs:
// 1. "data-scientist-data-science-digitalne" (4 words + company)
// 2. "velit-qui-mollit-sun-horizonjo"  
// 3. "senior-software-engineer-react-techcorp"

export { exampleJobs };