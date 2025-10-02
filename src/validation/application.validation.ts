import { z } from "zod";

// Application form validation schema
export const applicationValidationSchema = z.object({
  expected_salary: z
    .string()
    .min(1, "Expected salary is required")
    .refine((val) => {
      const numericValue = val.replace(/[^0-9]/g, '');
      const salary = parseInt(numericValue);
      return !isNaN(salary) && salary > 0;
    }, "Please enter a valid salary amount")
    .refine((val) => {
      const numericValue = val.replace(/[^0-9]/g, '');
      const salary = parseInt(numericValue);
      return salary >= 1000000; // Minimum 1 million IDR
    }, "Minimum salary should be at least Rp 1,000,000")
    .refine((val) => {
      const numericValue = val.replace(/[^0-9]/g, '');
      const salary = parseInt(numericValue);
      return salary <= 1000000000; // Maximum 1 billion IDR
    }, "Maximum salary should not exceed Rp 1,000,000,000"),
    
  cv: z
    .instanceof(File, { message: "CV file is required" })
    .refine((file) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return allowedTypes.includes(file.type);
    }, "Only PDF, DOC, and DOCX files are allowed")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB"),
    
  cover_letter: z
    .string()
    .optional()
    .refine((val) => {
      if (val && val.trim().length > 0) {
        return val.trim().length >= 10;
      }
      return true;
    }, "Cover letter must be at least 10 characters long")
    .refine((val) => {
      if (val && val.trim().length > 0) {
        return val.trim().length <= 2000;
      }
      return true;
    }, "Cover letter must not exceed 2000 characters"),
    
  job_id: z
    .number()
    .int()
    .positive("Job ID is required")
});

// Type inference from schema
export type ApplicationFormData = z.infer<typeof applicationValidationSchema>;

// Client-side validation for file upload
export const validateFile = (file: File | null): string | null => {
  if (!file) return "CV file is required";
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (!allowedTypes.includes(file.type)) return "Only PDF, DOC, and DOCX files are allowed";
  if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
  return null;
};

// Salary formatting and validation helper
export const formatSalaryInput = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  
  const number = parseInt(numericValue);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Extract numeric value from formatted salary
export const extractSalaryValue = (formattedSalary: string): number => {
  const numericValue = formattedSalary.replace(/[^0-9]/g, '');
  return parseInt(numericValue) || 0;
};

// Validate salary range
export const validateSalaryRange = (salary: number): string | null => {
  if (salary < 1000000) {
    return "Minimum salary should be at least Rp 1,000,000";
  }
  
  if (salary > 1000000000) {
    return "Maximum salary should not exceed Rp 1,000,000,000";
  }
  
  return null;
};