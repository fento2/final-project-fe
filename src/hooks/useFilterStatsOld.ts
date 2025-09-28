import { useState, useEffect } from "react";
import { useJobs } from "./useJobs";

interface FilterStats {
  categories: { [key: string]: number };
  jobTypes: { [key: string]: number };
  locations: { [key: string]: number };
  languages: { [key: string]: number };
  tools: { [key: string]: number };
  datePosted: { [key: string]: number };
  totalJobs: number;
}

export const useFilterStats = () => {
  const { jobs, loading } = useJobs();
  const [stats, setStats] = useState<FilterStats>({
    categories: {},
    jobTypes: {},
    locations: {},
    languages: {},
    tools: {},
    datePosted: {},
    totalJobs: 0,
  });

  useEffect(() => {
    if (!loading && jobs.length > 0) {
      const newStats: FilterStats = {
        categories: {},
        jobTypes: {},
        locations: {},
        languages: {},
        tools: {},
        datePosted: {},
        totalJobs: jobs.length,
      };

      // Calculate date ranges
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      jobs.forEach((job) => {
        // Count categories
        if (job.category) {
          newStats.categories[job.category] =
            (newStats.categories[job.category] || 0) + 1;
        }

        // Count job types
        if (job.job_type) {
          newStats.jobTypes[job.job_type] =
            (newStats.jobTypes[job.job_type] || 0) + 1;
        }

        // Count locations
        if (job.location) {
          newStats.locations[job.location] =
            (newStats.locations[job.location] || 0) + 1;
        }

        // Count languages (assuming it's stored in description)
        if (job.description) {
          const englishPattern = /english|inggris/i;
          const indonesianPattern = /indonesian|indonesia|bahasa indonesia/i;
          const spanishPattern = /spanish|spanyol/i;
          const italianPattern = /italian|italia/i;
          const turkishPattern = /turkish|turki/i;

          if (englishPattern.test(job.description)) {
            newStats.languages["English"] =
              (newStats.languages["English"] || 0) + 1;
          }
          if (indonesianPattern.test(job.description)) {
            newStats.languages["Indonesian"] =
              (newStats.languages["Indonesian"] || 0) + 1;
          }
          if (spanishPattern.test(job.description)) {
            newStats.languages["Spanish"] =
              (newStats.languages["Spanish"] || 0) + 1;
          }
          if (italianPattern.test(job.description)) {
            newStats.languages["Italian"] =
              (newStats.languages["Italian"] || 0) + 1;
          }
          if (turkishPattern.test(job.description)) {
            newStats.languages["Turkish"] =
              (newStats.languages["Turkish"] || 0) + 1;
          }
        }

        // Count tools (assuming they're mentioned in description)
        if (job.description) {
          const toolPatterns = {
            "Microsoft Word": /microsoft word|ms word|word/i,
            "Microsoft Excel": /microsoft excel|ms excel|excel/i,
            Figma: /figma/i,
            Canva: /canva/i,
            Photoshop: /photoshop|ps/i,
            Illustrator: /illustrator|ai/i,
          };

          Object.entries(toolPatterns).forEach(([tool, pattern]) => {
            if (pattern.test(job.description || "")) {
              newStats.tools[tool] = (newStats.tools[tool] || 0) + 1;
            }
          });
        }

        // Count by date posted
        if (job.createdAt) {
          const jobDate = new Date(job.createdAt);

          if (jobDate >= last24Hours) {
            newStats.datePosted["Last 24 hours"] =
              (newStats.datePosted["Last 24 hours"] || 0) + 1;
          }
          if (jobDate >= last3Days) {
            newStats.datePosted["Last 3 days"] =
              (newStats.datePosted["Last 3 days"] || 0) + 1;
          }
          if (jobDate >= last7Days) {
            newStats.datePosted["Last 7 days"] =
              (newStats.datePosted["Last 7 days"] || 0) + 1;
          }
          newStats.datePosted["Anytime"] = newStats.totalJobs;
        }
      });

      setStats(newStats);
    }
  }, [jobs, loading]);

  return { stats, loading };
};
