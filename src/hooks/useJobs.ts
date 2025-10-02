// Re-export all job-related hooks for backward compatibility
export { useJobs } from './useBasicJobs';
export { useAllJobs } from './useAllJobs';
export { useJob } from './useSingleJob';
export { useJobBySlug } from './useJobBySlug';
export { useFeaturedJobs, useJobsByCompany } from './useJobVariants';
export { useJobManagement } from './useJobManagement';
export { useSavedJobs, useJobApplications, useCompanyApplications } from './useJobActions';